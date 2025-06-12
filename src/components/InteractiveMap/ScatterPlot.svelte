<script>
  import { onMount, afterUpdate } from "svelte";
  import ChartIcon from "../../lib/Icons/ChartIcon.svelte"
  import * as d3 from "d3";

  let scatterContainer;
  let mounted = false;
  let svg;

  export let data = [];
  export let width = 580; 
  export let height = 510;
  
  let slope = 0;
  let intercept = 0;
  let rSquared = 0;
  let mse = 0; // Mean Squared Error
  let analysisType = "identity"; // "regression" or "identity"

  $: if (mounted && data && data.length > 0) {
    updateScatterPlot();
  }

  onMount(() => {
    mounted = true;
    initializeScatterPlot();
  });

  function handleAnalysisTypeChange(event) {
    analysisType = event.target.value;
    if (mounted && data && data.length > 0) {
      updateScatterPlot();
    }
  }

  function initializeScatterPlot() {
    if (!scatterContainer || !data || data.length === 0) {
      console.log("No data available for scatter plot");
      return;
    }

    d3.select(scatterContainer).selectAll("*").remove();

    const margin = { top: 20, right: 40, bottom: 60, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.bottom - margin.top;

    svg = d3.select(scatterContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "rgba(30, 32, 54, 0.02)")
      .style("border-radius", "16px");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const validData = data.filter(d => 
      d.safety_hololens != null && 
      d.safety_pp2 != null && 
      !isNaN(d.safety_hololens) && 
      !isNaN(d.safety_pp2)
    );

    if (validData.length === 0) {
      g.append("text")
        .attr("x", plotWidth / 2)
        .attr("y", plotHeight / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#64748b")
        .text("No valid data points");
      return;
    }

    const xScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([plotHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-plotHeight)
        .tickFormat("")
        .ticks(8)
      )
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.3)
      .selectAll("line")
      .style("stroke", "#cbd5e0");

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-plotWidth)
        .tickFormat("")
        .ticks(8)
      )
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.3)
      .selectAll("line")
      .style("stroke", "#cbd5e0");

    // Axes
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .style("font-size", "13px")
      .style("color", "#2d3748");
    
    xAxis.select(".domain")
      .style("stroke", "#4a5568")
      .style("stroke-width", 2);

    const yAxis = g.append("g")
      .call(d3.axisLeft(yScale).ticks(8))
      .style("font-size", "13px")
      .style("color", "#2d3748");
    
    yAxis.select(".domain")
      .style("stroke", "#4a5568")
      .style("stroke-width", 2);

    // Labels
    g.append("text")
      .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + 40})`)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#2d3748")
      .text("HoloLens Safety Score");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -plotHeight / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#2d3748")
      .text("PlacePulse2 Safety Score");

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("font-size", "13px")
      .style("pointer-events", "none")
      .style("z-index", "10000")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)");

    // Calculate and draw line based on analysis type
    const xDomain = xScale.domain();
    let lineData;
    
    if (analysisType === "regression" && validData.length > 1) {
      const regression = calculateLinearRegression(validData);
      slope = regression.slope;
      intercept = regression.intercept;
      rSquared = calculateRSquared(validData, slope, intercept);
      mse = calculateMSE(validData, slope, intercept);
      
      lineData = [
        { 
          x: xScale(xDomain[0]), 
          y: yScale(slope * xDomain[0] + intercept) 
        },
        { 
          x: xScale(xDomain[1]), 
          y: yScale(slope * xDomain[1] + intercept) 
        }
      ];
    } else if (analysisType === "identity") {
      // f(x) = x line
      slope = 1;
      intercept = 0;
      mse = calculateMSE(validData, 1, 0);
      
      lineData = [
        { 
          x: xScale(xDomain[0]), 
          y: yScale(xDomain[0]) 
        },
        { 
          x: xScale(xDomain[1]), 
          y: yScale(xDomain[1]) 
        }
      ];
    }

    // Draw line
    if (lineData) {
      const line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

      g.append("path")
        .datum(lineData)
        .attr("class", "regression-line")
        .attr("d", line)
        .style("stroke", "#2563eb") // Blue color
        .style("stroke-width", 3)
        .style("stroke-dasharray", analysisType === "identity" ? "none" : "8,4")
        .style("opacity", 0.8);
    }

    // Data points - single color for all points
    g.selectAll(".dot")
      .data(validData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.safety_hololens))
      .attr("cy", d => yScale(d.safety_pp2))
      .attr("r", 5)
      .style("fill", "#6366f1") // Single color for all points
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .style("opacity", 0.9)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .style("opacity", 1)
          .style("stroke-width", 3);
        
        tooltip
          .style("visibility", "visible")
          .html(`
            <div style="font-weight: bold; margin-bottom: 6px;">${d.name || 'Point'}</div>
            <div>HoloLens: <span style="color: #67e8f9;">${d.safety_hololens.toFixed(2)}</span></div>
            <div>PlacePulse2: <span style="color: #a78bfa;">${d.safety_pp2.toFixed(2)}</span></div>
            <div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">ID: ${d.id}</div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 60) + "px")
          .style("left", (event.pageX + 15) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .style("opacity", 0.9)
          .style("stroke-width", 2);
        
        tooltip.style("visibility", "hidden");
      });

    // Statistics display
    if (validData.length > 1) {
      const statsBox = g.append("g")
        .attr("transform", `translate(${plotWidth - 160}, 15)`);
      
      statsBox.append("rect")
        .attr("width", 150)
        .attr("height", 60)
        .attr("rx", 8)
        .style("fill", "rgba(255, 255, 255, 0.95)")
        .style("stroke", "#2563eb")
        .style("stroke-width", 1.5);
      
      statsBox.append("text")
        .attr("x", 75)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", "#2d3748")
        .text("Prediction Error");
        
      statsBox.append("text")
        .attr("x", 75)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "700")
        .style("fill", "#2563eb")
        .text(`MSE = ${mse.toFixed(3)}`);
        
      statsBox.append("text")
        .attr("x", 75)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#718096")
        .text(`n = ${validData.length} points`);
    }

    console.log(`ScatterPlot initialized with ${validData.length} points`);
  }

  function updateScatterPlot() {
    if (!mounted) return;
    initializeScatterPlot();
  }

  function calculateMSE(data, slope, intercept) {
    const n = data.length;
    let sumSquaredErrors = 0;
    
    data.forEach(d => {
      const predicted = slope * d.safety_hololens + intercept;
      const error = d.safety_pp2 - predicted;
      sumSquaredErrors += error * error;
    });
    
    return sumSquaredErrors / n;
  }

  function calculateRSquared(data, slope, intercept) {
    const n = data.length;
    const meanY = d3.mean(data, d => d.safety_pp2);
    
    let ssRes = 0;
    let ssTot = 0;
    
    data.forEach(d => {
      const predicted = slope * d.safety_hololens + intercept;
      const residual = d.safety_pp2 - predicted;
      const totalVariation = d.safety_pp2 - meanY;
      
      ssRes += residual * residual;
      ssTot += totalVariation * totalVariation;
    });
    
    const rSquared = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
    return Math.max(0, Math.min(1, rSquared));
  }

  function calculateLinearRegression(data) {
    const n = data.length;
    const sumX = d3.sum(data, d => d.safety_hololens);
    const sumY = d3.sum(data, d => d.safety_pp2);
    const sumXY = d3.sum(data, d => d.safety_hololens * d.safety_pp2);
    const sumX2 = d3.sum(data, d => d.safety_hololens * d.safety_hololens);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }
</script>

<div class="scatterplot-container">
  <div class="scatterplot-header">
    <div class="scatterplot-icon"><ChartIcon/></div>
    <div class="scatterplot-title">Safety Correlation Analysis</div>
    <div class="analysis-selector">
      <select bind:value={analysisType} on:change={handleAnalysisTypeChange}>
        <option class="color-option" value="identity">Function f(x) = x</option>
        <option class="color-option" value="regression">Linear Regression</option>
      </select>
    </div>
  </div>

  <div class="scatterplot-content" bind:this={scatterContainer}>
    {#if !data || data.length === 0}
      <div class="placeholder-content">
        <div class="placeholder-icon">📈</div>
        <div class="placeholder-text">No data available</div>
        <div class="placeholder-subtext">
          HoloLens vs PlacePulse2 Safety Scores
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  
  .color-option {
    color: "black";
  }

  .scatterplot-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 0.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    min-height: 600px;
  }

  .scatterplot-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  .scatterplot-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .scatterplot-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(76, 81, 191, 0.3);
  }

  .scatterplot-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    flex: 1;
  }

  .analysis-selector {
    margin-left: auto;
  }

  .analysis-selector select {
    padding: 8px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #2d3748;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
  }

  .analysis-selector select:hover {
    border-color: #4c51bf;
  }

  .analysis-selector select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .scatterplot-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 16px;
    border: 2px solid rgba(102, 126, 234, 0.2);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    min-height: 400px;
    padding: 10px;
  }

  .placeholder-content {
    text-align: center;
    color: #64748b;
  }

  .placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .placeholder-text {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #475569;
  }

  .placeholder-subtext {
    font-size: 0.9rem;
    color: #64748b;
  }

  :global(.d3-tooltip) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.4;
  }

  :global(.grid line) {
    stroke: #e2e8f0;
  }

  :global(.grid path) {
    stroke-width: 0;
  }

  :global(.scatterplot-content svg) {
    width: 100% !important;
    height: 100% !important;
  }
  
  :global(.scatterplot-content .domain) {
    stroke: #4a5568;
    stroke-width: 2;
  }
  
  :global(.scatterplot-content .tick line) {
    stroke: #718096;
  }
  
  :global(.scatterplot-content .tick text) {
    fill: #2d3748;
    font-weight: 500;
  }
</style>
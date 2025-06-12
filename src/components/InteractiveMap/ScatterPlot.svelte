<script>
    import { onMount, afterUpdate } from "svelte";
    import ChartIcon from "../../lib/Icons/ChartIcon.svelte"
    import * as d3 from "d3";
  
    let scatterContainer;
    let mounted = false;
    let svg;
  
    export let data = [];
    export let width = 610; 
    export let height = 550;
    
    let originalSlope = 0;
    let originalIntercept = 0;
    let customSlope = 0;
    let customIntercept = 0;
    let useCustomLine = false;
    let rSquared = 0;
    let currentRSquared = 0; // R² para la línea actual
  
    $: if (mounted && data && data.length > 0) {
      updateScatterPlot();
    }
  
    onMount(() => {
      mounted = true;
      initializeScatterPlot();
    });
  
    function initializeScatterPlot() {
      if (!scatterContainer || !data || data.length === 0) {
        console.log("No data available for scatter plot");
        return;
      }
  
      d3.select(scatterContainer).selectAll("*").remove();

      const margin = { top: 10, right: 40, bottom: 60, left: 50 };
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
  
      // Escalas fijas de 1 a 10
      const xScale = d3.scaleLinear()
        .domain([1, 10])
        .range([0, plotWidth]);

      const yScale = d3.scaleLinear()
        .domain([1, 10])
        .range([plotHeight, 0]);
  
      const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain(d3.extent(validData, d => d.safety_hololens));
  
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
  
      g.append("text")
        .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + 35})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .style("fill", "#2d3748")
        .text("HoloLens Safety Score");
  
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("x", -plotHeight / 2)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .style("fill", "#2d3748")
        .text("PlacePulse2 Safety Score");
  
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
  
      if (validData.length > 1) {
        const regression = calculateLinearRegression(validData);
        originalSlope = regression.slope;
        originalIntercept = regression.intercept;
        
        // Calcular R² original
        rSquared = calculateRSquared(validData, originalSlope, originalIntercept);
        
        if (customSlope === 0 && customIntercept === 0) {
          customSlope = originalSlope;
          customIntercept = originalIntercept;
        }
        
        const line = d3.line()
          .x(d => d.x)
          .y(d => d.y);
  
        const currentSlope = useCustomLine ? customSlope : originalSlope;
        const currentIntercept = useCustomLine ? customIntercept : originalIntercept;
        
        // Calcular R² actual basado en la línea mostrada
        currentRSquared = useCustomLine ? 
          calculateRSquared(validData, currentSlope, currentIntercept) : 
          rSquared;
        
        const lineData = [
          { x: 0, y: yScale(currentSlope * xScale.domain()[0] + currentIntercept) },
          { x: plotWidth, y: yScale(currentSlope * xScale.domain()[1] + currentIntercept) }
        ];
  
        g.append("path")
          .datum(lineData)
          .attr("class", "regression-line")
          .attr("d", line)
          .style("stroke", useCustomLine ? "#e53e3e" : "#4c51bf")
          .style("stroke-width", 3)
          .style("stroke-dasharray", useCustomLine ? "12,6" : "8,4")
          .style("opacity", 0.8);
      }
  
      g.selectAll(".dot")
        .data(validData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.safety_hololens))
        .attr("cy", d => yScale(d.safety_pp2))
        .attr("r", 5)
        .style("fill", d => colorScale(d.safety_hololens))
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
  
      if (validData.length > 1) {
        const corrBox = g.append("g")
          .attr("transform", `translate(${plotWidth - 120}, 15)`);
        
        corrBox.append("rect")
          .attr("width", 110)
          .attr("height", 50)
          .attr("rx", 6)
          .style("fill", "rgba(255, 255, 255, 0.95)")
          .style("stroke", useCustomLine ? "#e53e3e" : "#4c51bf")
          .style("stroke-width", 1.5);
        
        corrBox.append("text")
          .attr("x", 55)
          .attr("y", 15)
          .attr("text-anchor", "middle")
          .style("font-size", "11px")
          .style("font-weight", "500")
          .style("fill", "#4a5568")
          .text(useCustomLine ? "R² Ajuste" : "R² Original");
          
        corrBox.append("text")
          .attr("x", 55)
          .attr("y", 28)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "700")
          .style("fill", useCustomLine ? "#e53e3e" : "#4c51bf")
          .text(`R² = ${currentRSquared.toFixed(3)}`);
          
        // Mostrar R² original si estamos usando línea personalizada
        if (useCustomLine) {
          corrBox.append("text")
            .attr("x", 55)
            .attr("y", 42)
            .attr("text-anchor", "middle")
            .style("font-size", "9px")
            .style("font-weight", "400")
            .style("fill", "#718096")
            .text(`Original: R² = ${rSquared.toFixed(3)}`);
        }
      }
  
      console.log(`ScatterPlot initialized with ${validData.length} points`);
    }
  
    function updateScatterPlot() {
      if (!mounted) return;
      initializeScatterPlot();
    }
  
    function calculateRSquared(data, slope, intercept) {
      const n = data.length;
      const meanY = d3.mean(data, d => d.safety_pp2);
      
      let ssRes = 0; // Suma de cuadrados de residuos
      let ssTot = 0; // Suma total de cuadrados
      
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
    
    function resetToOriginal() {
      useCustomLine = false;
      customSlope = originalSlope;
      customIntercept = originalIntercept;
      updateScatterPlot();
    }
    
    function handleSlopeChange() {
      useCustomLine = true;
      updateScatterPlot();
    }
    
    function handleInterceptChange() {
      useCustomLine = true;
      updateScatterPlot();
    }
  </script>
  
  <div class="scatterplot-container">
    <div class="scatterplot-header">
      <div class="scatterplot-icon"><ChartIcon/></div>
      <div class="scatterplot-title">Safety Correlation Analysis</div>
    </div>
    
    <div class="controls-panel">
      <div class="equation-section">
        <div class="equation-display">
          <div class="equation-label">Ecuación:</div>
          <div class="equation-text">
            y = {useCustomLine ? customSlope.toFixed(3) : originalSlope.toFixed(3)}x + {useCustomLine ? customIntercept.toFixed(3) : originalIntercept.toFixed(3)}
          </div>
        </div>
      </div>
      
      <div class="sliders-section">
        <div class="slider-group">
          <label>Pendiente (m): {customSlope.toFixed(3)}</label>
          <input 
            type="range" 
            bind:value={customSlope} 
            min="-0.5" 
            max="2" 
            step="0.01"
            on:input={handleSlopeChange} 
            class="slider" 
          />
        </div>
        
        <div class="slider-group">
          <label>Intercepto (b): {customIntercept.toFixed(3)}</label>
          <input 
            type="range" 
            bind:value={customIntercept} 
            min="-5" 
            max="5" 
            step="0.1"
            on:input={handleInterceptChange} 
            class="slider" 
          />
        </div>
        
        <div class="button-section">
          <button on:click={resetToOriginal} class="reset-btn">
            Restaurar Original
          </button>
        </div>
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
      min-height: 700px;
    }
  
    .scatterplot-container:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }
  
    .scatterplot-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
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
    }
    
    .controls-panel {
      background: rgba(30, 32, 54, 0.08);
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 0.25rem;
      border: 1px solid rgba(76, 81, 191, 0.2);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    .equation-section {
      flex-shrink: 0;
    }
    
    .equation-display {
      text-align: left;
    }
    
    .equation-label {
      font-size: 0.8rem;
      color: #4a5568;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }
    
    .equation-text {
      font-size: 0.95rem;
      font-weight: 700;
      color: #4c51bf;
      font-family: 'Courier New', monospace;
      background: rgba(255, 255, 255, 0.9);
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      border: 1px solid rgba(76, 81, 191, 0.3);
      white-space: nowrap;
    }
    
    .sliders-section {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      flex: 1;
      flex-wrap: wrap;
    }
    
    .slider-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 140px;
    }
    
    .slider-group label {
      font-size: 0.78rem;
      font-weight: 600;
      color: #4a5568;
      white-space: nowrap;
    }
    
    .slider {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: linear-gradient(90deg, #e2e8f0, #cbd5e0);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .slider:hover {
      background: linear-gradient(90deg, #cbd5e0, #a0aec0);
    }
    
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #4c51bf, #553c9a);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(76, 81, 191, 0.4);
      transition: all 0.2s ease;
    }
    
    .slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(76, 81, 191, 0.6);
    }
    
    .slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #4c51bf, #553c9a);
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(76, 81, 191, 0.4);
    }
    
    .button-section {
      flex-shrink: 0;
    }
    
    .reset-btn {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
      border: none;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.78rem;
      white-space: nowrap;
    }
    
    .reset-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
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
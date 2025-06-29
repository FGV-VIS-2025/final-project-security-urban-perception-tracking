<script>
  import { onMount, afterUpdate } from "svelte";
  import ScatterIcon from "../../lib/Icons/ScatterIcon.svelte";
  import { createEventDispatcher } from "svelte";
  import * as d3 from "d3";

  let scatterContainer;
  let mounted = false;
  let svg;
  let g;
  let xScale, yScale;
  let validData = [];
  let plotWidth, plotHeight;
  let currentHoverSide = null;
  let countDisplay;

  export let data = [];
  export let width = 450;
  export let height = 425;
  export let selectedPointId = null;

  const dispatch = createEventDispatcher();

  $: if (mounted && selectedPointId !== null) {
    highlightSelectedPoint();
  }

  const colors = {
    points: {
      default: "#3b82f6",
      above: "#FF8A80",
      below: "#81C784",
      hover: "#5E35B1",
      selected: "#FF6B35",
    },
    line: "#4FC3F7",
    background: "rgba(248, 250, 252, 0.95)",
    histogram: "#3b82f6",
  };

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

    // Adjusted margins to accommodate histograms
    const margin = { top: 80, right: 80, bottom: 90, left: 60 };
    plotWidth = width - margin.left - margin.right;
    plotHeight = height - margin.bottom - margin.top;

    svg = d3
      .select(scatterContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", colors.background)
      .style("border-radius", "16px");

    g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    validData = data.filter(
      (d) =>
        d.safety_hololens != null &&
        d.safety_pp2 != null &&
        !isNaN(d.safety_hololens) &&
        !isNaN(d.safety_pp2),
    );

    if (validData.length === 0) {
      g.append("text")
        .attr("x", plotWidth / 2)
        .attr("y", plotHeight / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#64748b");
      return;
    }

    xScale = d3.scaleLinear().domain([0, 9]).range([0, plotWidth]);

    yScale = d3.scaleLinear().domain([0, 9]).range([plotHeight, 0]);

    // Create histogram groups
    const topHistogramGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 10)`);

    const rightHistogramGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + plotWidth + 10}, ${margin.top})`,
      );

    // Draw histograms
    drawTopHistogram(topHistogramGroup);
    drawRightHistogram(rightHistogramGroup);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-plotHeight).tickFormat("").ticks(8))
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.3)
      .selectAll("line")
      .style("stroke", "#cbd5e0");

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-plotWidth).tickFormat("").ticks(8))
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.3)
      .selectAll("line")
      .style("stroke", "#cbd5e0");

    // Axes
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .style("font-size", "13px")
      .style("color", "#2d3748");

    xAxis.select(".domain").style("stroke", "#4a5568").style("stroke-width", 2);

    const yAxis = g
      .append("g")
      .call(d3.axisLeft(yScale).ticks(8))
      .style("font-size", "13px")
      .style("color", "#2d3748");

    yAxis.select(".domain").style("stroke", "#4a5568").style("stroke-width", 2);

    // Axis labels
    g.append("text")
      .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + 40})`)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#2d3748")
      .text("Average safety scores from participants");

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
    const tooltip = d3
      .select("body")
      .append("div")
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

    // Identity line
    const xDomain = xScale.domain();
    const lineData = [
      { x: xScale(xDomain[0]), y: yScale(xDomain[0]) },
      { x: xScale(xDomain[1]), y: yScale(xDomain[1]) },
    ];

    const line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y);

    g.append("path")
      .datum(lineData)
      .attr("class", "identity-line")
      .attr("d", line)
      .style("stroke", colors.line)
      .style("stroke-width", 3)
      .style("opacity", 0.8)
      .style("filter", "drop-shadow(0 2px 4px rgba(79, 195, 247, 0.3))");

    // Count displays
    const countContainer = g.append("g").attr("class", "count-container");
    const aboveCountDisplay = countContainer
      .append("g")
      .attr("class", "above-count");

    aboveCountDisplay
      .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 120)
      .attr("height", 25)
      .style("fill", "rgba(255, 136, 128, 0.1)")
      .style("stroke", "rgba(255, 136, 128, 0.3)")
      .style("stroke-width", 1)
      .style("rx", 12)
      .style("opacity", 0);

    aboveCountDisplay
      .append("text")
      .attr("x", 70)
      .attr("y", 27)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#E57373")
      .style("opacity", 0);

    const belowCountDisplay = countContainer
      .append("g")
      .attr("class", "below-count");

    belowCountDisplay
      .append("rect")
      .attr("x", plotWidth - 130)
      .attr("y", plotHeight - 35)
      .attr("width", 120)
      .attr("height", 25)
      .style("fill", "rgba(129, 199, 132, 0.1)")
      .style("stroke", "rgba(129, 199, 132, 0.3)")
      .style("stroke-width", 1)
      .style("rx", 12)
      .style("opacity", 0);

    belowCountDisplay
      .append("text")
      .attr("x", plotWidth - 70)
      .attr("y", plotHeight - 18)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#81C784")
      .style("opacity", 0);

    // Mouse interaction overlay
    const overlay = g
      .append("rect")
      .attr("width", plotWidth)
      .attr("height", plotHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);

    // Scatter points
    g.selectAll(".dot")
      .data(validData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.safety_hololens))
      .attr("cy", (d) => yScale(d.safety_pp2))
      .attr("r", (d) => (d.id === selectedPointId ? 8 : 6))
      .style("fill", (d) =>
        d.id === selectedPointId
          ? colors.points.selected
          : colors.points.default,
      )
      .style("stroke", (d) => (d.id === selectedPointId ? "#fff" : "#fff"))
      .style("stroke-width", (d) => (d.id === selectedPointId ? 3 : 2))
      .style("opacity", (d) => (d.id === selectedPointId ? 1 : 0.85))
      .style("cursor", "pointer")
      .style("filter", (d) =>
        d.id === selectedPointId
          ? "drop-shadow(0 4px 8px rgba(255, 107, 53, 0.4))"
          : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
      )
      .style("transition", "all 0.3s ease")
      .on("mouseover", function (event, d) {
        if (currentHoverSide === null && d.id !== selectedPointId) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 9)
            .style("opacity", 1)
            .style("stroke-width", 3)
            .style("fill", colors.points.hover);
        }

        tooltip.style("visibility", "visible").html(`
            <div style="font-weight: bold; margin-bottom: 6px;">${d.name || "Point"}</div>
            <div>HoloLens: <span style="color: #67e8f9;">${d.safety_hololens.toFixed(2)}</span></div>
            <div>PlacePulse2: <span style="color: #a78bfa;">${d.safety_pp2.toFixed(2)}</span></div>

            ${d.id === selectedPointId ? '<div style="margin-top: 4px; color: #FF6B35; font-weight: bold;">• Selected</div>' : ""}
          `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 60 + "px")
          .style("left", event.pageX + 15 + "px");
      })
      .on("mouseout", function (event, d) {
        if (currentHoverSide === null && d.id !== selectedPointId) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 6)
            .style("opacity", 0.85)
            .style("stroke-width", 2)
            .style("fill", colors.points.default);
        }

        tooltip.style("visibility", "hidden");
      });

    if (selectedPointId !== null) {
      highlightSelectedPoint();
    }
  }

  function drawTopHistogram(group) {
    const histogramHeight = 60;
    const xValues = validData.map((d) => d.safety_hololens);

    // Create histogram bins
    const histogram = d3.histogram().domain(xScale.domain()).thresholds(15);

    const bins = histogram(xValues);

    const maxCount = d3.max(bins, (d) => d.length);
    const histScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .range([histogramHeight, 0]);

    group
      .selectAll(".hist-bar-top")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "hist-bar-top")
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => histScale(d.length))
      .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr("height", (d) => histogramHeight - histScale(d.length))
      .style("fill", colors.histogram)
      .style("stroke", "#ffffff")
      .style("stroke-width", 1)
      .style("opacity", 0.7);
  }

  function drawRightHistogram(group) {
    const histogramWidth = 60;
    const yValues = validData.map((d) => d.safety_pp2);

    // Create histogram bins
    const histogram = d3.histogram().domain(yScale.domain()).thresholds(15);

    const bins = histogram(yValues);

    // Create scale for histogram width
    const maxCount = d3.max(bins, (d) => d.length);
    const histScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .range([0, histogramWidth]);

    // Draw histogram bars
    group
      .selectAll(".hist-bar-right")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "hist-bar-right")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.x1))
      .attr("width", (d) => histScale(d.length))
      .attr("height", (d) => Math.max(0, yScale(d.x0) - yScale(d.x1) - 1))
      .style("fill", colors.histogram)
      .style("stroke", "#ffffff")
      .style("stroke-width", 1)
      .style("opacity", 0.7);
  }

  function highlightSelectedPoint() {
    if (!g || selectedPointId === null) return;

    g.selectAll(".dot")
      .transition()
      .duration(300)
      .attr("r", (d) => (d.id === selectedPointId ? 8 : 6))
      .style("fill", (d) =>
        d.id === selectedPointId
          ? colors.points.selected
          : colors.points.default,
      )
      .style("stroke-width", (d) => (d.id === selectedPointId ? 3 : 2))
      .style("opacity", (d) => (d.id === selectedPointId ? 1 : 0.85))
      .style("filter", (d) =>
        d.id === selectedPointId
          ? "drop-shadow(0 4px 8px rgba(255, 107, 53, 0.4))"
          : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
      );
  }

  function handleMouseMove(event) {
    const [mouseX, mouseY] = d3.pointer(event);

    const mouseXValue = xScale.invert(mouseX);
    const lineYAtMouseX = yScale(mouseXValue);

    const side = mouseY < lineYAtMouseX ? "above" : "below";

    if (side !== currentHoverSide) {
      currentHoverSide = side;
      updateAreaColors();
      updateCountDisplay();
    }
  }

  function handleMouseLeave() {
    currentHoverSide = null;
    updateAreaColors();
    hideCountDisplay();
  }

  function updateAreaColors() {
    g.selectAll(".area-overlay").remove();

    if (currentHoverSide !== null) {
      const areaColor =
        currentHoverSide === "above"
          ? colors.points.above
          : colors.points.below;

      let areaData;
      if (currentHoverSide === "above") {
        areaData = [
          [0, 0],
          [plotWidth, 0],
          [0, plotHeight],
          [0, 0],
        ];
      } else {
        areaData = [
          [0, plotHeight],
          [plotWidth, plotHeight],
          [plotWidth, 0],
          [0, plotHeight],
        ];
      }

      const area = d3
        .line()
        .x((d) => d[0])
        .y((d) => d[1]);

      g.append("path")
        .datum(areaData)
        .attr("class", "area-overlay")
        .attr("d", area)
        .style("fill", areaColor)
        .style("opacity", 0)
        .style("pointer-events", "none")
        .transition()
        .duration(300)
        .style("opacity", 0.12);
    }
  }

  function updateCountDisplay() {
    if (currentHoverSide === null) return;

    let aboveCount = 0;
    let belowCount = 0;

    validData.forEach((d) => {
      const lineYAtPointX = yScale(d.safety_hololens);
      const pointY = yScale(d.safety_pp2);
      const isAbove = pointY < lineYAtPointX;

      if (isAbove) {
        aboveCount++;
      } else {
        belowCount++;
      }
    });

    const aboveCountGroup = g.select(".above-count");
    const belowCountGroup = g.select(".below-count");

    if (currentHoverSide === "above") {
      aboveCountGroup
        .select("rect")
        .transition()
        .duration(300)
        .style("opacity", 1);

      aboveCountGroup
        .select("text")
        .text(`Above: ${aboveCount} points`)
        .transition()
        .duration(300)
        .style("opacity", 1);

      belowCountGroup
        .select("rect")
        .transition()
        .duration(300)
        .style("opacity", 0);

      belowCountGroup
        .select("text")
        .transition()
        .duration(300)
        .style("opacity", 0);
    } else if (currentHoverSide === "below") {
      belowCountGroup
        .select("rect")
        .transition()
        .duration(300)
        .style("opacity", 1);

      belowCountGroup
        .select("text")
        .text(`Below: ${belowCount} points`)
        .transition()
        .duration(300)
        .style("opacity", 1);

      aboveCountGroup
        .select("rect")
        .transition()
        .duration(300)
        .style("opacity", 0);

      aboveCountGroup
        .select("text")
        .transition()
        .duration(300)
        .style("opacity", 0);
    }
  }

  function hideCountDisplay() {
    const aboveCountGroup = g.select(".above-count");
    const belowCountGroup = g.select(".below-count");

    aboveCountGroup
      .selectAll("*")
      .transition()
      .duration(300)
      .style("opacity", 0);

    belowCountGroup
      .selectAll("*")
      .transition()
      .duration(300)
      .style("opacity", 0);
  }

  function updateScatterPlot() {
    if (!mounted) return;
    initializeScatterPlot();
  }

  function exportAsSVG() {
    if (!svg || !g) {
      console.error("SVG not initialized");
      return;
    }

    const svgClone = svg.node().cloneNode(true);
    const d3Clone = d3.select(svgClone);

    d3Clone
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .style("font-family", "system-ui, -apple-system, sans-serif");

    if (currentHoverSide !== null) {
      const gClone = d3Clone.select("g");

      const areaColor =
        currentHoverSide === "above"
          ? colors.points.above
          : colors.points.below;

      let areaData;
      if (currentHoverSide === "above") {
        areaData = [
          [0, 0],
          [plotWidth, 0],
          [0, plotHeight],
          [0, 0],
        ];
      } else {
        areaData = [
          [0, plotHeight],
          [plotWidth, plotHeight],
          [plotWidth, 0],
          [0, plotHeight],
        ];
      }

      const area = d3
        .line()
        .x((d) => d[0])
        .y((d) => d[1]);

      gClone
        .insert("path", ".dot")
        .datum(areaData)
        .attr("class", "area-overlay-export")
        .attr("d", area)
        .style("fill", areaColor)
        .style("opacity", 0.12)
        .style("pointer-events", "none");

      let aboveCount = 0;
      let belowCount = 0;

      validData.forEach((d) => {
        const lineYAtPointX = yScale(d.safety_hololens);
        const pointY = yScale(d.safety_pp2);
        const isAbove = pointY < lineYAtPointX;

        if (isAbove) {
          aboveCount++;
        } else {
          belowCount++;
        }
      });

      const countGroup = gClone
        .append("g")
        .attr("class", "count-display-export");

      if (currentHoverSide === "above") {
        countGroup
          .append("rect")
          .attr("x", 10)
          .attr("y", 10)
          .attr("width", 120)
          .attr("height", 25)
          .style("fill", "rgba(255, 136, 128, 0.1)")
          .style("stroke", "rgba(255, 136, 128, 0.3)")
          .style("stroke-width", 1)
          .style("rx", 12);

        countGroup
          .append("text")
          .attr("x", 70)
          .attr("y", 27)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-weight", "600")
          .style("fill", "#E57373")
          .text(`Above: ${aboveCount} points`);
      } else if (currentHoverSide === "below") {
        countGroup
          .append("rect")
          .attr("x", plotWidth - 130)
          .attr("y", plotHeight - 35)
          .attr("width", 120)
          .attr("height", 25)
          .style("fill", "rgba(129, 199, 132, 0.1)")
          .style("stroke", "rgba(129, 199, 132, 0.3)")
          .style("stroke-width", 1)
          .style("rx", 12);

        countGroup
          .append("text")
          .attr("x", plotWidth - 70)
          .attr("y", plotHeight - 18)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-weight", "600")
          .style("fill", "#81C784")
          .text(`Below: ${belowCount} points`);
      }
    }

    const titleGroup = d3Clone
      .insert("g", ":first-child")
      .attr("class", "export-metadata");

    const timestamp = new Date().toLocaleString();
    titleGroup
      .append("text")
      .attr("x", width - 10)
      .attr("y", height - 10)
      .attr("text-anchor", "end")
      .style("font-size", "10px")
      .style("fill", "#94a3b8")
      .text(`Exported: ${timestamp}`);

    const svgString = new XMLSerializer().serializeToString(svgClone);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `safety-correlation-analysis-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    dispatch("svgExported", {
      filename: `safety-correlation-analysis-${Date.now()}.svg`,
      timestamp: new Date().toISOString(),
    });

    console.log("SVG exported successfully");
  }

  function exportBothAreas(customOptions = {}) {
    if (!svg || !g) {
      console.error("SVG not initialized");
      return;
    }

    // Calculate counts for both areas
    let aboveCount = 0;
    let belowCount = 0;

    validData.forEach((d) => {
      const lineYAtPointX = yScale(d.safety_hololens);
      const pointY = yScale(d.safety_pp2);
      const isAbove = pointY < lineYAtPointX;

      if (isAbove) {
        aboveCount++;
      } else {
        belowCount++;
      }
    });

    const defaultOptions = {
      filename: `safety-analysis-both-areas-${aboveCount}above-${belowCount}below-${Date.now()}.svg`,
      includeTitle: true,
      includeTimestamp: true,
    };

    const options = { ...defaultOptions, ...customOptions };

    const svgClone = svg.node().cloneNode(true);
    const d3Clone = d3.select(svgClone);

    d3Clone
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .style("font-family", "system-ui, -apple-system, sans-serif");

    const gClone = d3Clone.select("g");

    const aboveAreaData = [
      [0, 0],
      [plotWidth, 0],
      [0, plotHeight],
      [0, 0],
    ];

    const belowAreaData = [
      [0, plotHeight],
      [plotWidth, plotHeight],
      [plotWidth, 0],
      [0, plotHeight],
    ];

    const areaLine = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1]);

    gClone
      .insert("path", ".dot")
      .datum(aboveAreaData)
      .attr("class", "area-overlay-above-export")
      .attr("d", areaLine)
      .style("fill", colors.points.above)
      .style("opacity", 0.12)
      .style("pointer-events", "none");

    gClone
      .insert("path", ".dot")
      .datum(belowAreaData)
      .attr("class", "area-overlay-below-export")
      .attr("d", areaLine)
      .style("fill", colors.points.below)
      .style("opacity", 0.12)
      .style("pointer-events", "none");

    const countGroup = gClone.append("g").attr("class", "count-display-export");

    countGroup
      .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 120)
      .attr("height", 25)
      .style("fill", "rgba(255, 136, 128, 0.1)")
      .style("stroke", "rgba(255, 136, 128, 0.3)")
      .style("stroke-width", 1)
      .style("rx", 12);

    countGroup
      .append("text")
      .attr("x", 70)
      .attr("y", 27)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#E57373")
      .text(`Above: ${aboveCount} points`);

    countGroup
      .append("rect")
      .attr("x", plotWidth - 130)
      .attr("y", plotHeight - 35)
      .attr("width", 120)
      .attr("height", 25)
      .style("fill", "rgba(129, 199, 132, 0.1)")
      .style("stroke", "rgba(129, 199, 132, 0.3)")
      .style("stroke-width", 1)
      .style("rx", 12);

    countGroup
      .append("text")
      .attr("x", plotWidth - 70)
      .attr("y", plotHeight - 18)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#81C784")
      .text(`Below: ${belowCount} points`);

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = options.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    dispatch("svgExported", {
      filename: options.filename,
      timestamp: new Date().toISOString(),
      area: "both",
      aboveCount: aboveCount,
      belowCount: belowCount,
      abovePercentage: ((aboveCount / validData.length) * 100).toFixed(1),
      belowPercentage: ((belowCount / validData.length) * 100).toFixed(1),
      totalPoints: validData.length,
    });

    console.log(
      `SVG exported successfully with both areas: ${options.filename}`,
    );
  }
</script>

<div class="scatterplot-container">
  <div class="scatterplot-header">
    <div class="scatterplot-icon"><ScatterIcon /></div>
    <div class="scatterplot-title">Safety Correlation Analysis</div>
    <button
      class="export-button"
      title="Export as SVG"
      on:click={() => {
        exportBothAreas({
          filename: "scatterplot.svg",
        });
      }}
    >
      <!--
      <button
        class="export-button"
        title="Export as SVG"
        on:click={exportAsSVG}
      >
      </button>
    -->
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  </div>

  <div class="scatterplot-content" bind:this={scatterContainer}>
    {#if !data || data.length === 0}
      <div class="placeholder-content">
        <div class="placeholder-icon">📈</div>
        <div class="placeholder-text">No data available</div>
        <div class="placeholder-subtext">
          Average Safety Scores vs PlacePulse2 Safety Scores
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .export-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    border-radius: 8px;
    padding: 8px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
    min-width: 36px;
    height: 36px;
  }

  .export-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }

  .export-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  }

  .export-button svg {
    width: 16px;
    height: 16px;
  }

  .scatterplot-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    justify-content: space-between;
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
  }

  .scatterplot-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  .scatterplot-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .scatterplot-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .scatterplot-title {
    font-size: 1rem;
    font-weight: 500;
    color: #2d3748;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    flex: 1;
  }

  .scatterplot-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 16px;
    border: 2px solid rgba(139, 95, 191, 0.2);
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

  :global(.hist-bar-top, .hist-bar-right) {
    transition: opacity 0.3s ease;
  }

  :global(.hist-bar-top:hover, .hist-bar-right:hover) {
    opacity: 1 !important;
  }
</style>

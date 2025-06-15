<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { base } from "$app/paths";
  
    export let selectedParticipant = null;
  
    let svgElement;
    let mounted = false;
    let participantData = {};
    let loading = true;
    let error = null;
    let hasBeenSelected = false; 
  
    async function loadData() {
      try {
        loading = true;
        error = null;
        const response = await fetch(base + "/diagram.json");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        participantData = await response.json();
        loading = false;
      } catch (err) {
        console.error("Error loading diagram data:", err);
        error = err.message;
        loading = false;
      }
    }
  
    function calculateSimilarity(arr1, arr2) {
      const set1 = new Set(arr1);
      const set2 = new Set(arr2);
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      return intersection.size / union.size; // Jaccard similarity
    }
  
    function createChordMatrix() {
      const participants = Object.keys(participantData);
      const n = participants.length;
      
      if (n === 0) return { matrix: [], participants: [] };
      
      const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
  
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            const similarity = calculateSimilarity(
              participantData[participants[i]], 
              participantData[participants[j]]
            );
            matrix[i][j] = similarity * 100; 
          }
        }
      }
  
      return { matrix, participants };
    }
  
    function drawChordDiagram() {
      if (!svgElement || loading || Object.keys(participantData).length === 0) return;
  
      d3.select(svgElement).selectAll("*").remove();
  
      const { matrix, participants } = createChordMatrix();
      
      if (participants.length === 0) {
        const svg = d3.select(svgElement)
          .attr("width", 400)
          .attr("height", 400);
        
        svg.append("text")
          .attr("x", 200)
          .attr("y", 200)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("fill", "#666")
          .text("No hay datos para mostrar");
        
        return;
      }
      
      const width = 400;
      const height = 400;
      const outerRadius = Math.min(width, height) * 0.4;
      const innerRadius = outerRadius - 20;
  
      const svg = d3.select(svgElement)
        .attr("width", width)
        .attr("height", height);
  
      const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
  
      const color = d3.scaleOrdinal()
        .domain(participants)
        .range(d3.schemeCategory10);
  
      const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);
  
      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
      const ribbon = d3.ribbon()
        .radius(innerRadius);
  
      const chords = chord(matrix);
  
      const group = g.append("g")
        .selectAll("g")
        .data(chords.groups)
        .enter().append("g");

      function isRelatedToSelected(participantIndex) {
        if (selectedParticipant === null) return true;
        const currentParticipant = participants[participantIndex];

        if (currentParticipant === selectedParticipant.toString()) {
          console.log(`✓ Coincidencia encontrada: ${currentParticipant} === ${selectedParticipant}`);
          return true;
        }
        if (currentParticipant === selectedParticipant) {
          console.log(`✓ Coincidencia directa: ${currentParticipant} === ${selectedParticipant}`);
          return true;
        }
        
        return false;
      }

      function isConnectionRelated(sourceIndex, targetIndex) {
        if (selectedParticipant === null) return true;
        return isRelatedToSelected(sourceIndex) || isRelatedToSelected(targetIndex);
      }

      if (selectedParticipant !== null) {
        console.log("=== DEBUG INFO ===");
        console.log("selectedParticipant:", selectedParticipant, typeof selectedParticipant);
        console.log("participants array:", participants);
        console.log("Mapping check:");
        participants.forEach((p, i) => {
          console.log(`  Index ${i}: participant="${p}", matches=${isRelatedToSelected(i)}`);
        });
      }
  
      group.append("path")
        .style("fill", d => color(participants[d.index]))
        .style("stroke", d => d3.rgb(color(participants[d.index])).darker())
        .style("stroke-width", "2px")
        .style("opacity", d => {
          if (!hasBeenSelected && selectedParticipant === null) return 1;
          if (selectedParticipant !== null) return isRelatedToSelected(d.index) ? 1 : 0.2;
          return 0.3;
        })
        .attr("d", arc)
        .on("mouseover", function(event, d) {
          d3.select(this).style("opacity", 1);
          const tooltip = d3.select("body").append("div")
            .attr("class", "chord-tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .text(`Participant ${participants[d.index]}`);
          
          setTimeout(() => tooltip.remove(), 150);
        })
        .on("mouseout", function(event, d) {
          d3.select(this).style("opacity", 
            (!hasBeenSelected && selectedParticipant === null) ? 1 :
            (selectedParticipant !== null && isRelatedToSelected(d.index)) ? 1 : 
            (selectedParticipant !== null) ? 0.2 : 0.3);
        });
  
      group.append("text")
        .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("transform", d => `
          rotate(${(d.angle * 180 / Math.PI - 90)})
          translate(${outerRadius + 10})
          ${d.angle > Math.PI ? "rotate(180)" : ""}
        `)
        .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .style("font-size", "12px")
        .style("font-weight", d => {
          if (selectedParticipant === null) return "bold";
          return isRelatedToSelected(d.index) ? "bold" : "normal";
        })
        .style("fill", d => {
          if (selectedParticipant === null) return "#333";
          return isRelatedToSelected(d.index) ? "#333" : "#999";
        })
        .text(d => `P${participants[d.index]}`);
  
      // Dibujar las conexiones (ribbons)
      g.append("g")
        .selectAll("path")
        .data(chords)
        .enter().append("path")
        .attr("d", ribbon)
        .style("fill", d => color(participants[d.source.index]))
        .style("opacity", d => {
          if (!hasBeenSelected && selectedParticipant === null) return 0.6;
          if (selectedParticipant !== null) return isConnectionRelated(d.source.index, d.target.index) ? 0.8 : 0.05;
          return 0.15;
        })
        .style("stroke", d => d3.rgb(color(participants[d.source.index])).darker())
        .style("stroke-width", d => {
          if (!hasBeenSelected && selectedParticipant === null) return "1px";
          if (selectedParticipant !== null) return isConnectionRelated(d.source.index, d.target.index) ? "2px" : "1px";
          return "1px";
        })
        .on("mouseover", function(event, d) {
          d3.select(this).style("opacity", 0.9);
          const similarity = (d.source.value / 100).toFixed(3);
          const tooltip = d3.select("body").append("div")
            .attr("class", "chord-tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .text(`P${participants[d.source.index]} ↔ P${participants[d.target.index]}`);
            //.text(`P${participants[d.source.index]} ↔ P${participants[d.target.index]}: ${similarity} similitud`);
          
          setTimeout(() => tooltip.remove(), 150);
        })
        .on("mouseout", function(event, d) {
          d3.select(this).style("opacity", 
            (!hasBeenSelected && selectedParticipant === null) ? 0.6 :
            (selectedParticipant !== null && isConnectionRelated(d.source.index, d.target.index)) ? 0.8 :
            (selectedParticipant !== null) ? 0.05 : 0.15);
        });
    }
  
    $: if (mounted && svgElement && !loading) {
      drawChordDiagram();
    }
  
    $: if (selectedParticipant !== null && mounted && !loading) {
      hasBeenSelected = true; // Marcar que se ha seleccionado algo
      console.log(`Participante seleccionado: ${selectedParticipant}`);
      drawChordDiagram();
    }

    $: if (selectedParticipant === null && hasBeenSelected && mounted && !loading) {
      console.log("Participante deseleccionado - estado opaco");
      drawChordDiagram();
    }
  
    onMount(async () => {
      mounted = true;
      await loadData();
    });
  </script>
  
  <div class="chord-diagram-section">
      <svg bind:this={svgElement} class="chord-svg"></svg>
  </div>
  
  <style>
    .chord-diagram-section {
      flex: 1;
      background: #f8fafc;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    :global(.chord-tooltip) {
      z-index: 1000;
    }
  </style>
// 1. DATA: usual spend per person (USD)
const data = [
  { place: "Molly Tea",     category: "Tea shop",   min: 7,  max: 10 },
  { place: "Teazzi",        category: "Tea shop",   min: 7,  max: 10 },
  { place: "HeyTea",        category: "Tea shop",   min: 8,  max: 12 },
  { place: "Tsaocaa",       category: "Tea shop",   min: 8,  max: 12 },
  { place: "Corner Bakery", category: "Bakery",     min: 10, max: 15 },
  { place: "10 Second",     category: "Restaurant", min: 15, max: 20 },
  { place: "Kajiken",       category: "Restaurant", min: 15, max: 25 },
  { place: "Nai Brother",   category: "Restaurant", min: 20, max: 25 },
  { place: "Tora",          category: "Restaurant", min: 20, max: 30 },
  { place: "Dynasty",       category: "Dim sum",    min: 30, max: 40 },
  { place: "Empire Garden", category: "Dim sum",    min: 30, max: 40 }
];
 
// Compute the midpoint of each range, then sort cheapest to most expensive
data.forEach(d => d.mid = (d.min + d.max) / 2);
data.sort((a, b) => a.mid - b.mid);
 
// 2. SIZE: margins leave room for the axes and labels
const margin = { top: 20, right: 30, bottom: 50, left: 120 };
const width = 700 - margin.left - margin.right;
const height = 420 - margin.top - margin.bottom;
 
// 3. SVG: create the drawing area inside #price-chart
const svg = d3.select("#price-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
 
// 4. SCALES: turn data values into pixel positions and colors
const x = d3.scaleLinear().domain([0, 45]).range([0, width]);
const y = d3.scaleBand().domain(data.map(d => d.place)).range([0, height]).padding(0.25);
const color = d3.scaleOrdinal()
  .domain(["Tea shop", "Bakery", "Restaurant", "Dim sum"])
  .range(["#6a9fb5", "#e0a458", "#c75c5c", "#8e6c8a"]);
 
// 5. BARS: one rectangle per place, as long as its midpoint price
svg.selectAll(".bar")
  .data(data)
  .join("rect")
  .attr("class", "bar")
  .attr("x", 0)
  .attr("y", d => y(d.place))
  .attr("width", d => x(d.mid))
  .attr("height", y.bandwidth())
  .attr("fill", d => color(d.category));
 
// 6. RANGE LINES: from min price to max price
svg.selectAll(".range")
  .data(data)
  .join("line")
  .attr("x1", d => x(d.min))
  .attr("x2", d => x(d.max))
  .attr("y1", d => y(d.place) + y.bandwidth() / 2)
  .attr("y2", d => y(d.place) + y.bandwidth() / 2)
  .attr("stroke", "#333")
  .attr("stroke-width", 2);
 
// 7. LABELS: show the price range at the end of each line
svg.selectAll(".label")
  .data(data)
  .join("text")
  .attr("x", d => x(d.max) + 6)
  .attr("y", d => y(d.place) + y.bandwidth() / 2 + 4)
  .text(d => `$${d.min}–${d.max}`)
  .style("font-size", "12px");
 
// 8. AXES
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).tickFormat(d => `$${d}`));
svg.append("g").call(d3.axisLeft(y));
 
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 40)
  .attr("text-anchor", "middle")
  .text("Usual spend per person (USD)");
 
// 9. LEGEND: one colored square per category
const legend = svg.append("g").attr("transform", `translate(${width - 130}, 0)`);
color.domain().forEach((cat, i) => {
  const row = legend.append("g").attr("transform", `translate(0, ${i * 22})`);
  row.append("rect").attr("width", 14).attr("height", 14).attr("fill", color(cat));
  row.append("text").attr("x", 20).attr("y", 11).text(cat).style("font-size", "13px");
});
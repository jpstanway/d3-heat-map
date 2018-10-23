
// create global variables
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const dataset = [];
const base = 8.66;
let json, req;

// request data from api
req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = () => {

    // store data in json variable
    json = JSON.parse(req.responseText);

    json.monthlyVariance.forEach((data) => {
        dataset.push({
            year: data.year,
            month: data.month - 1,
            change: data.variance,
            temp: base + data.variance
        });
    });

    // svg chart specific variables
    const w = 1080;
    const h = 600;
    const p = 65;
    
    const rectW = 4;
    const rectH = 45;

    const legendW = 540;
    const legendH = 65;
    const legendP = 25;

    const legendRectW = 70;
    const legendRectH = 40;

    // create arrays with additional data
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                   
    // create function for assigning colors
    const colors = [
        [[1, 2], '#080051'], 
        [[3, 4], '1D06FF'], 
        [[5, 6], '#6F06E8'],
        [[7, 8], '#D607FF'], 
        [[9, 10], '#E80692'], 
        [[11, 12], '#FF0500'], 
        [[13, 15], '#4b0200']
    ];

    function colorMap(temp) {
        const num = Number(temp.toFixed(0));
        
        for(let i = 0; i < colors.length; i++){
            for(let j = 0; j < colors[i][0].length; j++) {
                if(num === colors[i][0][j]) {
                    return colors[i][1];
                }
            }
        }
    }                

    // create tooltip
    const tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .attr('id', 'tooltip')
                  .html((d) => {
                    d3.select('#tooltip').attr('data-year', d.year);
                    return `
                        <p>${months[d.month]} ${d.year}</p>
                        <p>${d.change.toFixed(2)}&#8451; | ${d.temp.toFixed(2)}&#8451;</p>
                    `;
                  });                

    // create main map and legend areas
    const map = d3.select('#map')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .call(tip);

    const legend = d3.select('#legend')                
                    .append('svg')
                    .attr('width', legendW)
                    .attr('height', legendH);

    // create scales
    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                    .range([p, w - p]);
                  
    const yScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.month), d3.max(dataset, (d) => d.month)])
                    .range([p, h - p]);

    const legendScale = d3.scaleLinear()
                          .domain([d3.min(colors[0][0], (d) => d), d3.max(colors[6][0], (d) => d)])
                          .range([legendP, legendW - legendP]);                
               
    // create axes
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat((d, i) => {
                        return months[i];
                    });

    const legendAxis = d3.axisBottom(legendScale)
                        .tickValues([1, 3, 5, 7, 9, 11, 13, 15]);                

    // append axes to svg
    map.append('g')
        .attr('transform', `translate(0, ${h - p + 45})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    map.append('g')
        .attr('transform', `translate(${p}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);    

    // create and append rect elements for data
    map.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr('class', 'cell')
       .attr('width', rectW)
       .attr('height', rectH)
       .attr('x', (d) => xScale(d.year))
       .attr('y', (d) => yScale(d.month))
       .attr('data-month', (d) => d.month)
       .attr('data-year', (d) => d.year)
       .attr('data-temp', (d) => d.change)
       .style('fill', (d) => colorMap(d.temp))
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);   

    // append axis to legend area
    legend.append('g')
          .attr('transform', `translate(0, ${legendH - legendP})`)
          .attr('id', 'legend-axis')
          .call(legendAxis);

    // append rect elements to legend
    legend.selectAll('rect')
          .data(colors)
          .enter()
          .append('rect')
          .attr('class', 'legend-colors')
          .attr('width', legendRectW)
          .attr('height', legendRectH)
          .attr('x', (d) => {
              const min = d3.min(d[0]);
              return legendScale(min);
          })
          .attr('y', 0)
          .style('fill', (d) => {
            const min = d3.min(d[0]);
            return colorMap(min);
          });
}

// create global variables
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const dataset = [];
let json, req;

// request data from api
req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = () => {

    // store data in json variable
    json = JSON.parse(req.responseText);
    console.log(json);

    json.monthlyVariance.forEach((data) => {
        dataset.push({
            year: data.year,
            month: data.month,
            change: data.variance
        });
    });

    console.log(dataset);

    // svg chart dimensions
    const w = 1080;
    const h = 600;
    const p = 60;

    // create array with month names
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

    // create tooltip
    const tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .attr('id', 'tooltip')
                  .html((d) => {
                    d3.select('#tooltip').attr('data-year', d.year);
                    return `
                        <p>${d.month} ${d.year}</p>
                        <p>${d.change}</p>
                    `;
                  });                

    // create svg
    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .call(tip);

    // create scales
    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                    .range([p, w - p])
                    .nice();

    const yScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.month), d3.max(dataset, (d) => d.month)])
                    .range([p, h - p]);

    // create axes
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat((d, i) => {
                        return months[i];
                    });

    // append axes to svg
    svg.append('g')
        .attr('transform', `translate(0, ${h - p})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${p}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);    

    // create and append rect elements for data
    svg.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr('class', 'cell')
       .attr('width', 2)
       .attr('height', h / 12)
       .attr('x', (d) => xScale(d.year))
       .attr('y', (d) => yScale(d.month))
       .attr('data-month', (d) => d.month)
       .attr('data-year', (d) => d.year)
       .attr('data-temp', (d) => d.change)
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);
}
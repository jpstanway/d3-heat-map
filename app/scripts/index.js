
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

    // svg chart dimensions
    const w = 1080;
    const h = 600;
    const p = 30;

    // create svg
    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

    // create scales
    const xScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([p, w - p]);

    const yScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([p, h - p]);

    // create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);    

    // append axes to svg
    svg.append('g')
        .attr('transform', `translate(0, ${h - p})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${p}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);    



    
}
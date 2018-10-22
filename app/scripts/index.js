
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
            month: data.month,
            change: data.variance,
            temp: base + data.variance
        });
    });

    // svg chart specific variables
    const w = 1080;
    const h = 600;
    const p = 60;
    
    const rectW = 4;
    const rectH = 45;

    // create arrays with additional data
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                   
    // create function for assigning colors
    const colors = ['#080051', '1D06FF', '#6F06E8', '#D607FF', '#E80692', '#FF0500', '#4b0200'];

    function colorMap(temp) {
        switch(true) {
            case (temp <= 3):
                console.log(colors[0]);
                return colors[0];
                break;
            case (temp <= 5):
                return colors[1];
                break;
            case (temp <= 7):
                return colors[2];
                break;        
            case (temp <= 9):
                return colors[3];
                break;
            case (temp <= 11):
                return colors[4];
                break;
            case (temp <= 13):
                return colors[5];
                break;
            case (temp <= 14):
                return colors[6];
                break;    
            default:
                return 'black';
                break;                
       }
    }                

    // create tooltip
    const tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .attr('id', 'tooltip')
                  .html((d) => {
                    d3.select('#tooltip').attr('data-year', d.year);
                    return `
                        <p>${d.month} ${d.year}</p>
                        <p>${d.temp.toFixed(2)}&#8451; | ${d.change.toFixed(2)}&#8451;</p>
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
}
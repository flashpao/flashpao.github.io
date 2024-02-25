let table;
let minGDP, maxGDP;
let minConsumption, maxConsumption;
let minGNI, maxGNI;
let minEmployment, maxEmployment;
let minSize, maxSize;
let minYear, maxYear;
let yearToDisplay = 2002; // Default year to display
let margin = 60;
let h;

function preload() {
  // Preload CSV data
  table = loadTable('data/common_data.csv', 'csv', 'header');
  h = table.getRowCount();
}

function setupValue(year){
  minGDP = Number.MAX_VALUE;
  maxGDP = -Number.MAX_VALUE;
  minConsumption = Number.MAX_VALUE;
  maxConsumption = -Number.MAX_VALUE;
  minGNI = Number.MAX_VALUE;
  maxGNI = -Number.MAX_VALUE;
  minEmployment = Number.MAX_VALUE;
  maxEmployment = -Number.MAX_VALUE;
  // Iterate through each row of the CSV table to find min and max values
  
  for (let i = 0; i < table.getRowCount(); i++) {

    let row = table.getRow(i);
    if( row.getNum('Year') === year){
      console.log("pass");
      // Get the GDP per capita value for the current row and update min and max values
      let gdp = row.getNum('GDP per capita');
      if (!isNaN(gdp)) {
        minGDP = min(minGDP, gdp);
        maxGDP = max(maxGDP, gdp);
      }
      
      // Get the Total dependency ratio value for the current row and update min and max values
      let consumption = row.getNum('consumption');
      if (!isNaN(consumption)) {
        minConsumption = min(minConsumption, consumption);
        maxConsumption = max(maxConsumption, consumption);
      }
      
      // Get the Population value for the current row and update min and max values
      let GNI = row.getNum('GNI per capita');
      if (!isNaN(GNI)) {
        minGNI = min(minGNI, GNI);
        maxGNI = max(maxGNI, GNI);
      }
      
      // Get the Unemployment value for the current row and update min and max values
      let Employment = row.getNum('Employment');
      if (!isNaN(Employment)) {
        minEmployment = min(minEmployment, Employment);
        maxEmployment = max(maxEmployment, Employment);
      }
    }
    
  }
}

function getMinGniValues(year) {
  let GNIValues = []; 
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    if(row.getNum("Year") == year){
      let GNI = row.getNum('GNI per capita');
      if (!isNaN(GNI)) { 
        GNIValues.push(GNI);
      }
    }
  }
  GNIValues.sort((a, b) => b - a); 
  if (GNIValues.length >= 15) {
    return GNIValues[14]; 
  } else {
    return null; 
  }
}

function getGniValues(year) {
  let GNIValues = []; 
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    if(row.getNum("Year") == year){
      let GNI = row.getNum('GNI per capita');
      GNIValues.push(GNI);
    }
  }
  GNIValues.sort((a, b) => a - b); 
  return GNIValues
}


function getCount(year) {
  let count = 0; 
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    if(row.getNum("Year") == year){
      count += 1 ;
    }
  }
  return count;
}


function setup() {
  if (table) {
    let rows = table.getRows();

    rows.sort((a, b) => {
      return a.getNum('GNI per capita') - b.getNum('GNI per capita');
    });
    let sortedTable = new p5.Table();
    sortedTable.columns = table.columns;
    for (let i = rows.length-1; i > 0; i--) {
      sortedTable.addRow(rows[i]);
    }
    table = sortedTable;
  }
  h = getCount(2019)*30;

  createCanvas(1200, 900+h); // Create canvas

  noLoop(); 

  let years = table.getColumn('Year').map(Number);
  minYear = min(years);
  maxYear = max(years);
  minSize = 10;
  maxSize = 80;

  yearSlider = select('#yearSlider');
  yearSlider.elt.min = minYear;
  yearSlider.elt.max = maxYear;
  yearSlider.elt.value = yearToDisplay;
  yearSlider.changed(() => {
    yearToDisplay = yearSlider.value();
    redraw(); // Redraw the canvas when the slider changes
    document.getElementById('yearDisplay').innerText = yearToDisplay; // Update the year display on the page
  });

  setupValue(yearToDisplay);

}
function draw() {
  background(255); // Set background color

  drawDotsForYear(yearToDisplay);

}

function drawLegend() {
  // Legend position and size settings
  let legendX = width - margin * 2;
  let legendY = margin / 2 +h;
  let legendWidth = margin;
  let legendHeight = margin * 2 ;
  
  // Draw legend background
  fill(255, 255, 255, 20);
  noStroke();
  rect(legendX, legendY, legendWidth, legendHeight);

  // Draw legend items
  let legendItemHeight = legendHeight / 5; 
  for (let i = 0; i < 5; i++) {
    fill(getColorForLegend(i)); 
    rect(legendX + 5, legendY + 5 + i * legendItemHeight, 10, 10);
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    text(`${i * 20}% - ${(i + 1) * 20}%`, legendX + 20, legendY + 10 + i * legendItemHeight);
  }
}

function getColorForLegend(index) {
  // Return the color corresponding to the legend index
  let colors = ['PowderBlue', 'LightSkyBlue', 'DodgerBlue', 'RoyalBlue','MediumSlateBlue'];
  return colors[index];
}

function drawDotsForYear(year) {

  clear(); // Clear previous drawings
  background(255);
  
  yearSlider = select('#yearSlider');
  setupValue(year)
  // Iterate through each data row
  let pad = 1;
  for (let i = 0; i < table.getRowCount(); i++) {
    let currentRow = table.getRow(i);
    let currentYear = currentRow.getNum('Year');
    if (currentYear === year) {
      let country = currentRow.getString('Entity');
      let gdp = currentRow.getNum('GDP per capita');
      let consumption = currentRow.getNum('consumption');
      let GNI = currentRow.getNum('GNI per capita');
      let employment = currentRow.getNum('Employment');


      let barHeight = h/getCount(year) * 2 / 3; 
      let padding = h/getCount(year) / 3; 
      let xbar = map(GNI, minGNI, maxGNI, 0+margin+200, width-margin-250); 
      let ybar = pad * (barHeight + padding);
      pad += 1;

      fill(0);
      textAlign(RIGHT, CENTER);
      text(country, margin+120, ybar + barHeight/2);
      fill("red"); 
      noStroke();
      rect(margin+120, ybar, xbar, barHeight);

      fill(0);
      textAlign(RIGHT, CENTER);
      text(Math.round(GNI)+"$", xbar+margin+200, ybar + barHeight/2);


      // Calculate mapped values
      let x = map(employment, minEmployment, maxEmployment, 0+margin, width-margin); 
      let y = map(GNI, minGNI, maxGNI, height-margin, margin + h); 
      let size = map(gdp, minGDP, maxGDP, minSize, maxSize); 

      if (GNI >= getMinGniValues(year)){
        let col = getColorFromDependencyRatio(consumption);
        // Draw dots
        fill(col);
        noStroke();
        ellipse(x, y , size, size);

        fill(0); 
        noStroke();
        textAlign(CENTER, CENTER); 
        textSize(12);
        text(country, x, y); 
      }
    }
  }
  // Draw coordinate axes
  stroke(0);
  strokeWeight(2);
  // X-axis
  line(margin, height - margin , width - margin, height - margin );
  // Y-axis
  line(margin, margin + h , margin , height - margin );

  // Draw axis labels
  textSize(20);
  textAlign(CENTER, CENTER);
  fill("black");
  // X-axis label
  text("Employment rate", width / 2, height - margin / 2 );
  // Y-axis label
  push();
  translate(margin / 2, height / 2 + h/2);
  rotate(-PI / 2);
  text("Income", 0, 0);
  pop();
  // Draw legend
  textSize(12);
  drawLegend();
}

function getColorFromDependencyRatio(dependencyRatio) {
  if (dependencyRatio <= 20) {
    return color('PowderBlue');
  } else if (dependencyRatio <= 40) {
    return color('LightSkyBlue');
  } else if (dependencyRatio <= 60) {
    return color('DodgerBlue');
  } else if (dependencyRatio <= 80) {
    return color('RoyalBlue');
  } else {
    return color('MediumSlateBlue');
  }
}['PowderBlue', 'LightSkyBlue', 'DodgerBlue', 'RoyalBlue','MediumSlateBlue']
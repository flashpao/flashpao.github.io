let table;
let minGDP, maxGDP;
let minConsumption, maxConsumption;
let minGNI, maxGNI;
let minEmployment, maxEmployment;
let minSize, maxSize;
let minYear, maxYear;
let yearToDisplay = 2002; // Default year to display
let margin = 60;


function preload() {
  // Preload CSV data
  table = loadTable('data/common_data.csv', 'csv', 'header');
}

function drawDot(ctx, x, y, size, col) {
    ctx.fillStyle = col; // 设置填充颜色
    ctx.beginPath(); // 开始一个新的路径
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI); // 创建一个圆：arc(x, y, radius, startAngle, endAngle)
    ctx.fill(); // 填充圆形
}
function setBackground(ctx, color) {
    ctx.fillStyle = color; // 设置填充颜色
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 填充整个画布
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

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
function setup() {
    canvas.width = 1200;
    canvas.height = 900;
  
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
    setBackground(ctx, 'white');
  
    drawDotsForYear(yearToDisplay);
  
  }

  function getColorFromDependencyRatio(dependencyRatio) {
    if (dependencyRatio <= 20) {
      return color('LightSkyBlue');
    } else if (dependencyRatio <= 40) {
      return color('DodgerBlue');
    } else if (dependencyRatio <= 60) {
      return color('RoyalBlue');
    } else if (dependencyRatio <= 80) {
      return color('MidnightBlue');
    } else {
      return color('Black');
    }
  }

  function drawDotsForYear(year) {

    //clear(); // Clear previous drawings
    setBackground(ctx, 'white');
    
    yearSlider = select('#yearSlider');
    setupValue(year)
    // Iterate through each data row
    for (let i = 0; i < table.getRowCount(); i++) {
      let currentRow = table.getRow(i);
      let currentYear = currentRow.getNum('Year');
      if (currentYear === year) {
        let gdp = currentRow.getNum('GDP per capita');
        let consumption = currentRow.getNum('consumption');
        let GNI = currentRow.getNum('GNI per capita');
        let employment = currentRow.getNum('Employment');
        // Calculate mapped values
        let x = map(employment, minEmployment, maxEmployment, 0+margin, width-margin); 
        let y = map(GNI, minGNI, maxGNI, height-margin, margin); 
        let size = map(gdp, minGDP, maxGDP, minSize, maxSize); 
  
        let col = getColorFromDependencyRatio(consumption);
        // Draw dots
        drawDot(ctx, x, y, size, col)
      }
    }
    
  }
preload()
setup();
draw();
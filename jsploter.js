function createGraph(dataMatrice, backgroundColor = "rgb(255,255,255)", graphType = 0, cHeight = 100, cWidth = 300, cleanPrint = true, noDataString = "NO DATA", xOffset = 15, yOffset = 15, font = "verdana", textAngle = 90, randomify = false){
  switch(graphType){
    case 0:
    case "simple":
      return dataInSimpleLine(dataMatrice, backgroundColor, cHeight, cWidth, noDataString, xOffset, yOffset, font, textAngle);
    case 1:
    case "hist":
      return dataInHistogram(dataMatrice, backgroundColor, cHeight, cWidth, noDataString, xOffset, yOffset, font, textAngle);
    case 2:
    case "pie":
      return dataInPie(dataMatrice, backgroundColor, cWidth, noDataString, xOffset, font);
    case 3:
    case "line":
      if(randomify){
        for(let i = 0; i < dataMatrice.length; i++){
          if(dataMatrice[i][1] == 0){
            dataMatrice[i][1] = parseInt(randomNumber(1, 100));
          }
        }
      }
      let arrayCanvas = dataInLine(dataMatrice, backgroundColor, cHeight, cWidth, noDataString, xOffset, yOffset, font, textAngle, cleanPrint);
      let canvasHeight = arrayCanvas[1][0].height;
      let canvasWidth = arrayCanvas[1][0].width;
      let arrayButtons = [];
      if(arrayCanvas.length == 2){
        return arrayCanvas[1][0];
      } else {
        for(let i in arrayCanvas){
          arrayButtons[i] = document.createElement("button");
          if(arrayCanvas[i][1] == "mainCanvas"){
            arrayButtons[i].style.background = "white";
          } else {
            arrayButtons[i].style.background = arrayCanvas[i][1];
          }
          arrayButtons[i].style.height = canvasHeight / 5;
          arrayButtons[i].style.width = canvasWidth / 15;
          arrayButtons[i].style.zIndex = "0";
          arrayButtons[i].style.marginTop = "-4px";
          arrayButtons[i].style.marginRight = "2px";
          arrayButtons[i].style.borderRadius = "0px 0px 4px 4px";
          arrayButtons[i].style.outline = "none";
          arrayButtons[i].style.border = "1px solid grey";
          arrayButtons[i].style.boxShadow = "2px 2px 5px grey";

          arrayCanvas[i][0].style.borderRadius = "4px";
          arrayCanvas[i][0].style.visibility = "hidden";
          arrayCanvas[i][0].style.position = "absolute";
          arrayCanvas[i][0].style.top = 0;
          arrayCanvas[i][0].style.left = 0;
        }
        arrayButtons[0].style.border = "2px solid grey";
        arrayButtons[0].style.marginLeft = canvasWidth / 35;
        arrayCanvas[0][0].style.visibility = "visible";
        
        let mainContainer = document.createElement("div");
        let container = document.createElement("div");
        let buttonContainer = document.createElement("div");
        container.style.width = canvasWidth;
        mainContainer.style.width = canvasWidth;
        container.style.height = canvasHeight;
        mainContainer.style.height = canvasHeight + canvasHeight / 5;
        container.style.position = "relative";
        container.style.cursor = "pointer";
        for(let i = 0; i < arrayCanvas.length; i++){
          arrayButtons[i].addEventListener('mousedown', function(e){ e.preventDefault(); }, false);
          arrayButtons[i].addEventListener("click", function(){showChildrenByIndex(container, i)});
          arrayButtons[i].addEventListener("mouseup", function(){borderMeUnborderMySiblings(arrayButtons[i])});
          buttonContainer.append(arrayButtons[i]);
          container.append(arrayCanvas[i][0]);
        }
        container.style.border = "1px solid grey";
        container.style.borderRadius = "4px";
        container.style.zIndex = "1";
        

        mainContainer.style.padding = (parseInt(canvasHeight) / 5) / 2;

        mainContainer.append(container);
        mainContainer.append(buttonContainer);
        return mainContainer;
      }
    case 4:
    case "web":
      return dataInWeb(dataMatrice, backgroundColor);
  }
}

function changeChildrenVisibility(container){
  let array = container.children;
  let maxSize = array.length;
  let currentVisible = 0;
  for(let i = 0; i < array.length; i++){
    if(array[i].style.visibility == "visible"){
      currentVisible = i + 1;
      if(currentVisible >= maxSize){
        currentVisible = 0;
      }
      array[i].style.visibility = "hidden";
    } else {
      array[i].style.visibility = "hidden";
    }
  }
  array[currentVisible].style.visibility = "visible";
}

function showChildrenByIndex(container, index){
  let array = container.children;
  for(let i = 0; i < array.length; i++){
    array[i].style.visibility = "hidden";
  }
  array[index].style.visibility = "visible";
}

function borderMeUnborderMySiblings(button){
  let arrayMeAndSiblings = button.parentElement.children;
  for(let i in arrayMeAndSiblings){
    if(arrayMeAndSiblings[i].isSameNode(button)){
      button.style.border = "2px solid grey";
    } else {
      arrayMeAndSiblings[i].style.border = "1px solid grey";
    }
  }
}

function dataInSimpleLine(dataMatrice, backgroundColor = "rgb(255,255,255)", canvasHeight = 100, canvasWidth = 300, noDataString = "NO DATA", xOffset = 15, yOffset = 15, fontFamily = "verdana", textAngle = 45){
  var backgroundColorArray = colorArray(backgroundColor);
  let canvas = document.createElement("canvas");
  
  let context = canvas.getContext("2d");

  let highestX = 0;
  let highestY = 0;
  let widestWord = "";
  let checkDataExistence = 0;
  for(let i in dataMatrice){
    if(dataMatrice[i][0] > highestX){
      highestX = dataMatrice[i][0];
    }
    if(dataMatrice[i][1] > highestY){
      highestY = dataMatrice[i][1];
    }
    if(dataMatrice[i][3].length > widestWord.length){
      widestWord = dataMatrice[i][3];
    }
    dataMatrice[i][0]++;
    checkDataExistence += dataMatrice[i][1];
  }

  context.font = "10px " + fontFamily;
  let extraHeight = Math.sin(textAngle * Math.PI / 180) * context.measureText(widestWord).width;
  let extraWidth = Math.cos(textAngle * Math.PI / 180) * context.measureText(widestWord).width;
  if(extraHeight < 0 || checkDataExistence == 0){
    extraHeight = 0;
  }
  if(extraWidth < 0 || checkDataExistence == 0){
    extraWidth = 0;
  }
  canvas.height = canvasHeight + extraHeight;
  canvas.width = canvasWidth + extraWidth;
  
  
  //setting background color
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(xOffset, yOffset);
  context.lineTo(xOffset,canvasHeight - yOffset);
  context.lineTo(canvasWidth - xOffset,canvasHeight - yOffset);
  context.stroke();

  if(checkDataExistence > 0){
    for(let i in dataMatrice){
      context.beginPath();
      var dataColorArray = colorArray(dataMatrice[i][2]);
      if(isDarkRGB(dataColorArray) && isDarkRGB(backgroundColorArray)){
        var dataColor = alternateBrightness(dataMatrice[i][2]);
      } else {
        var dataColor = dataMatrice[i][2];
      }
      context.strokeStyle = dataColor;
      let xdelta = canvasWidth - xOffset * 3;
      let x = dataMatrice[i][0] * xdelta;
      let ybase = canvasHeight - yOffset;
      let ydata = dataMatrice[i][1] * (canvasHeight - yOffset * 2);
      let ydelta = ybase - ydata/highestY;
      let actualX = x/highestX + xOffset;
      context.moveTo(actualX, ybase);
      context.lineTo(actualX, ydelta);
      context.stroke();
      context.fillStyle = dataColor;
      context.save();
      context.translate(actualX - 2 - (xOffset / 2) * Math.abs(Math.cos(textAngle * Math.PI / 180)), ybase + 2 + (yOffset/2) * Math.abs(Math.cos(textAngle * Math.PI / 180)));
      context.rotate(textAngle * Math.PI / 180);
      context.font = "10px " + fontFamily;
      if(isDarkRGB(backgroundColorArray)){
        var strokeColor = "rgba(255,255,255,0.3)";
      } else {
        var strokeColor = "rgba(0,0,0,0.3)";
      }
      context.strokeStyle = strokeColor;
      context.fillText(dataMatrice[i][3], 0, 0);
      context.strokeText(dataMatrice[i][3], 0, 0);
      context.restore();
    }
  } else {
    context.font = "20px " + fontFamily;
    if(isDarkRGB(backgroundColorArray)){
      var strokeColor = "rgba(255,255,255,0.3)";
    } else {
      var strokeColor = "rgba(0,0,0,0.3)";
    }
    context.strokeStyle = strokeColor;
    context.fillText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
    context.strokeText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
  }
  return canvas;
}

function dataInHistogram(dataMatrice, backgroundColor = "rgb(255,255,255)", canvasHeight = 100, canvasWidth = 300, noDataString = "NO DATA", xOffset = 15, yOffset = 15, fontFamily = "verdana" , textAngle = 45){
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  
  let highestX = 0;
  let highestY = 0;
  let widestWord = "";
  let checkDataExistence = 0;
  for(let i in dataMatrice){
    if(dataMatrice[i][0] > highestX){
      highestX = dataMatrice[i][0];
    }
    if(dataMatrice[i][1] > highestY){
      highestY = dataMatrice[i][1];
    }
    if(dataMatrice[i][3].length > widestWord.length){
      widestWord = dataMatrice[i][3];
    }
    dataMatrice[i][0]++;
    checkDataExistence += dataMatrice[i][1];
  }

  context.save();
  context.font = "10px " + fontFamily;
  let extraHeight = Math.sin(textAngle * Math.PI / 180) * context.measureText(widestWord).width;
  let extraWidth = Math.cos(textAngle * Math.PI / 180) * context.measureText(widestWord).width;
  if(extraHeight < 0 || checkDataExistence == 0){
    extraHeight = 0;
  }
  if(extraWidth < 0 || checkDataExistence == 0){
    extraWidth = 0;
  }
  canvas.height = canvasHeight + extraHeight;
  canvas.width = canvasWidth + extraWidth;
  context.restore();

  //setting background color
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(xOffset, yOffset);
  context.lineTo(xOffset,canvasHeight - yOffset);
  context.lineTo(canvasWidth - xOffset,canvasHeight - yOffset);
  context.stroke();
  
  if(checkDataExistence > 0){
    let dataStartX = 0;
    for(let i in dataMatrice){
      context.beginPath();
      let xDelta = dataMatrice[i][0] * (canvasWidth - xOffset * 3) / highestX;
      let xStartDelta = xDelta - dataStartX;
      let yDelta = dataMatrice[i][1] * (canvasHeight - yOffset * 2)/highestY;
      let xStart = dataStartX + xOffset + 1;
      let yStart = canvasHeight - yDelta - yOffset - 1;
      context.fillStyle = dataMatrice[i][2];
      context.fillRect(xStart, yStart, xStartDelta, yDelta);
      context.save();
      context.translate(xStart + 1, canvasHeight - yOffset + 2 + (yOffset/2) * Math.abs(Math.cos(textAngle * Math.PI / 180)));
      context.rotate(textAngle * Math.PI / 180);
      if(!isDarkRGB(colorArray(dataMatrice[i][2]))){
        context.fillStyle = alternateBrightness(dataMatrice[i][2]);
      } else {
        context.fillStyle = dataMatrice[i][2];
      }
      context.strokeStyle = "rgba(0,0,0,0.2)";
      context.font = "10px " + fontFamily;
      context.fillText(dataMatrice[i][3], 0, 0);
      context.strokeText(dataMatrice[i][3], 0, 0);
      context.restore();
      dataStartX = xDelta;
    }
  } else {
    context.font = "20px " + fontFamily;
    if(isDarkRGB(colorArray(backgroundColor))){
      var strokeColor = "rgba(255,255,255,0.3)";
    } else {
      var strokeColor = "rgba(0,0,0,0.3)";
    }
    context.strokeStyle = strokeColor;
    context.fillText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
    context.strokeText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
  }
  return canvas;
}

function dataInPie(dataMatrice, backgroundColor = "rgb(255,255,255)", canvasWidth = 200, noDataString = "NO DATA", xOffset = 15, fontFamily = "verdana", pieBorderColor = "rgba(0,0,0,1)"){
  let canvas = document.createElement("canvas");
  
  let context = canvas.getContext("2d");

  let widestWord = "";
  for(let i in dataMatrice){
    if(dataMatrice[i][3].length > widestWord.length){
      widestWord = dataMatrice[i][3];
    }
  }

  let extraWidth = context.measureText(widestWord).width;
  canvas.height = canvasWidth + extraWidth;
  canvas.width = canvasWidth + extraWidth;
  if(isEven(canvas.width)){
    canvas.width += 1;
  }
  
  //setting background color
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.strokeStyle = pieBorderColor;
  context.arc(canvas.width/2, canvas.width/2, canvasWidth / 2 - xOffset, 0, 2 * Math.PI);
  context.stroke();

  let pieTotal = 0;
  for(let i in dataMatrice){
    dataMatrice[i][0] = dataMatrice[i][1];
    pieTotal += dataMatrice[i][1];
  }

  if(pieTotal > 0){
    var startDegree = 0;
    for(let i in dataMatrice){
      var deltaDegree = (dataMatrice[i][1] * 360 / pieTotal) * Math.PI / 180;
      context.beginPath();
      context.fillStyle = dataMatrice[i][2];
      context.moveTo(canvas.width/2, canvas.width/2);
      context.arc(canvas.width/2, canvas.width/2, canvasWidth / 2 - xOffset, startDegree, startDegree + deltaDegree);
      context.lineTo(canvas.width/2, canvas.width/2);
      context.stroke();
      context.fill();
  
      context.save();
      context.translate(canvas.width/2, canvas.width/2);
      context.rotate(startDegree + deltaDegree / 2);
      //context.fillStyle = alternateBrightness(dataMatrice[i][2]);
      if(isDarkRGB(colorArray(dataMatrice[i][2]))){
        context.strokeStyle = "rgba(255,255,255,0.5)";  
      } else {
        context.strokeStyle = "rgba(0,0,0,0.5)";
      }
      context.font = "12px " + fontFamily;
      context.fillText(dataMatrice[i][3], (canvasWidth / 2 - xOffset + 1), xOffset / 3);
      //context.strokeText(dataMatrice[i][3], (canvasWidth / 2 - xOffset), xOffset / 3);
      context.restore();
      
      startDegree = startDegree + deltaDegree;
    }
  } else {
    context.font = "20px " + fontFamily;
    if(isDarkRGB(colorArray(backgroundColor))){
      var strokeColor = "rgba(255,255,255,0.3)";
    } else {
      var strokeColor = "rgba(0,0,0,0.3)";
    }
    context.strokeStyle = strokeColor;
    context.fillText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
    context.strokeText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
  }
  return canvas;
}

function dataInLine(dataMatrice, backgroundColor = "rgb(255,255,255)", canvasHeight = 100, canvasWidth = 300, noDataString = "NO DATA", xOffset = 15, yOffset = 15, fontFamily = "verdana", textAngle = 45, cleanPrinting = true){
  let array = [];
  
  let highestX = 0;
  let highestY = 0;
  let firstArrayStart = 0;
  let linesMatrice = [];
  let matriceCounter = 0;
  let widestString = "";
  let checkDataExistence = 0;
  for(let i in dataMatrice){
    if(dataMatrice[i][0] > highestX){
      highestX = dataMatrice[i][0];
    }
    if(dataMatrice[i][1] > highestY){
      highestY = dataMatrice[i][1];
    }
    if(dataMatrice[i][3].length > widestString.length){
      widestString = dataMatrice[i][3];
    }
    if(dataMatrice[i][4] != undefined && dataMatrice[i][4] == "breakData"){
      linesMatrice[matriceCounter] = [];
      for(let j = firstArrayStart; j<=i; j++){
        linesMatrice[matriceCounter].push(dataMatrice[j]);
      }
      firstArrayStart = parseInt(i)+1;
      matriceCounter++;
    }
    checkDataExistence += dataMatrice[i][1];
  }

  let canvas = document.createElement("canvas");
  
  let context = canvas.getContext("2d");

  let extraHeight = Math.sin(textAngle * Math.PI / 180) * context.measureText(widestString).width;
  let extraWidth = Math.cos(textAngle * Math.PI / 180) * context.measureText(widestString).width;
  if(extraHeight < 0 || checkDataExistence == 0){
    extraHeight = 0;
  }
  if(extraWidth < 0 || checkDataExistence == 0){
    extraWidth = 0;
  }
  canvas.height = canvasHeight + extraHeight;
  canvas.width = canvasWidth + extraWidth;

  //setting background color for individual graphs
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(xOffset * 2, yOffset);
  context.lineTo(xOffset * 2, canvasHeight - yOffset);
  context.lineTo(canvasWidth - xOffset, canvasHeight - yOffset);
  context.stroke();


  if(checkDataExistence > 0){
    for(let c in linesMatrice){
      let lineColor = undefined;
      let alternativeCanvas = document.createElement("canvas");
      
      alternativeCanvas.height = canvasHeight + extraHeight;
      alternativeCanvas.width = canvasWidth + extraWidth;
      let alternativeContext = alternativeCanvas.getContext("2d");
  
      //setting background color for graph composed by all parts
      alternativeContext.fillStyle = backgroundColor;
      alternativeContext.fillRect(0, 0, canvas.width, canvas.height);
      //drawing both line axys
      alternativeContext.beginPath();
      alternativeContext.strokeStyle = "black";
      alternativeContext.moveTo(xOffset * 2, yOffset);
      alternativeContext.lineTo(xOffset * 2,canvasHeight - yOffset);
      alternativeContext.lineTo(canvasWidth - xOffset,canvasHeight - yOffset);
      alternativeContext.stroke();
      
      for(let i = 1; i < linesMatrice[c].length; i++){
  
        let x = ((linesMatrice[c][i-1][0] * (canvasWidth - xOffset * 3))/highestX) + xOffset * 2;
        let y = canvasHeight - (((linesMatrice[c][i-1][1] * (canvasHeight - yOffset * 3))/highestY) + yOffset);
        
        
        if(linesMatrice[c][i-1][1] > 0 && !cleanPrinting){
          alternativeContext.beginPath();
          alternativeContext.setLineDash([5, 3]);
          alternativeContext.moveTo(xOffset * 2,y);
          alternativeContext.lineTo(x,y);
          // if(isDarkRGB(colorArray(linesMatrice[c][i-1][2])) && isDarkRGB(colorArray(backgroundColor)) || !isDarkRGB(colorArray(linesMatrice[c][i-1][2])) && !isDarkRGB(colorArray(backgroundColor))){
          //   alternativeContext.lineWidth = 0.8;
          //   if(lineColor == undefined){
          //     lineColor = alternateBrightness(linesMatrice[c][i-1][2]);
          //   }
          // } else {
          //   alternativeContext.lineWidth = 0.4;
          //   if(lineColor == undefined){
          //     lineColor = linesMatrice[c][i-1][2];
          //   }
          // }
  
          //temporary fix
          lineColor = linesMatrice[c][i-1][2];
          //temporary fix
  
          //Y - left side
          alternativeContext.strokeStyle = lineColor;
          alternativeContext.stroke();
        }
        
        alternativeContext.fillStyle = "black";
        if(!cleanPrinting){
          alternativeContext.font = "10px " + fontFamily;
          alternativeContext.fillText(linesMatrice[c][i-1][1], xOffset, y);
        } else {
          if(linesMatrice[c][i-1][1] == highestY){
            alternativeContext.font = "10px " + fontFamily;
            alternativeContext.fillText(linesMatrice[c][i-1][1], xOffset, y);
          }
        }
  
        if(linesMatrice[c][i-1][1] > 0 && !cleanPrinting){
          alternativeContext.beginPath();
          alternativeContext.setLineDash([5, 3]);
          alternativeContext.moveTo(x,canvasHeight - yOffset);
          alternativeContext.lineTo(x,y);
          // if(isDarkRGB(colorArray(linesMatrice[c][i-1][2])) && isDarkRGB(colorArray(backgroundColor)) || !isDarkRGB(colorArray(linesMatrice[c][i-1][2])) && !isDarkRGB(colorArray(backgroundColor))){
          //   alternativeContext.lineWidth = 0.8;
          //   if(lineColor == undefined){
          //     lineColor = alternateBrightness(linesMatrice[c][i-1][2]);
          //   }
          // } else {
          //   alternativeContext.lineWidth = 0.4;
          //   if(lineColor == undefined){
          //     lineColor = linesMatrice[c][i-1][2];
          //   }
          // }
  
          //temporary fix
          lineColor = linesMatrice[c][i-1][2];
          //temporary fix
  
          //X - bottom
          alternativeContext.strokeStyle = lineColor;
          alternativeContext.stroke();
        }
  
        alternativeContext.save();
        alternativeContext.fillStyle = "black";
        alternativeContext.font = "10px " + fontFamily;
        alternativeContext.translate(x - 2 - (xOffset / 2) * Math.cos(textAngle * Math.PI / 180), canvasHeight - yOffset + 2 + (yOffset/2) * Math.abs(Math.cos(textAngle * Math.PI / 180)));
        alternativeContext.rotate(textAngle * Math.PI / 180);
        alternativeContext.fillText(linesMatrice[c][i-1][3], 0, 0);
        alternativeContext.restore();
  
        context.beginPath();
        context.setLineDash([0]);
        context.lineWidth = 1;
        context.moveTo(x,y);
        alternativeContext.beginPath();
        alternativeContext.setLineDash([0]);
        alternativeContext.lineWidth = 1;
        alternativeContext.moveTo(x,y);
  
        x = ((linesMatrice[c][i][0] * (canvasWidth - xOffset * 3))/highestX) + xOffset * 2;
        y = canvasHeight - (((linesMatrice[c][i][1] * (canvasHeight - yOffset * 3))/highestY) + yOffset);
  
        alternativeContext.lineTo(x,y);
        alternativeContext.strokeStyle = "black";
        alternativeContext.stroke();
  
        //main/central line
        context.lineTo(x,y);
        context.strokeStyle = lineColor;
        context.stroke();
  
        //LAST (x,y)
        if(i == linesMatrice[c].length - 1){
          if(linesMatrice[c][i][1] > 0 && !cleanPrinting){
            alternativeContext.beginPath();
            alternativeContext.setLineDash([5, 3]);
            alternativeContext.moveTo(xOffset * 2,y);
            alternativeContext.lineTo(x,y);
            // if(isDarkRGB(colorArray(linesMatrice[c][i][2])) && isDarkRGB(colorArray(backgroundColor)) || !isDarkRGB(colorArray(linesMatrice[c][i][2])) && !isDarkRGB(colorArray(backgroundColor))){
            //   alternativeContext.lineWidth = 0.8;
            //   if(lineColor == undefined){
            //     lineColor = alternateBrightness(linesMatrice[c][i][2]);
            //   }
            // } else {
            //   alternativeContext.lineWidth = 0.4;
            //   if(lineColor == undefined){
            //     lineColor = linesMatrice[c][i][2];
            //   }
            // }
  
            //temporary fix
            lineColor = linesMatrice[c][i][2];
            //temporary fix
  
            //Y - left side
            alternativeContext.strokeStyle = lineColor;
            alternativeContext.stroke();
          }
  
          alternativeContext.fillStyle = "black";
          if(!cleanPrinting){
            alternativeContext.font = "10px " + fontFamily;
            alternativeContext.fillText(linesMatrice[c][i][1], xOffset, y);
          } else {
            if(linesMatrice[c][i][1] == highestY){
              alternativeContext.font = "10px " + fontFamily;
              alternativeContext.fillText(linesMatrice[c][i][1], xOffset, y);
            }
          }
  
          if(linesMatrice[c][i][1] > 0 && !cleanPrinting){
            alternativeContext.beginPath();
            alternativeContext.setLineDash([5, 3]);
            alternativeContext.moveTo(x,canvasHeight - yOffset);
            alternativeContext.lineTo(x,y);
            // if(isDarkRGB(colorArray(linesMatrice[c][i][2])) && isDarkRGB(colorArray(backgroundColor)) || !isDarkRGB(colorArray(linesMatrice[c][i][2])) && !isDarkRGB(colorArray(backgroundColor))){
            //   alternativeContext.lineWidth = 0.8;
            //   if(lineColor == undefined){
            //     lineColor = alternateBrightness(linesMatrice[c][i][2]);
            //   }
            // } else {
            //   alternativeContext.lineWidth = 0.4;
            //   if(lineColor == undefined){
            //     lineColor = linesMatrice[c][i][2];
            //   }
            // }
  
            //temporary fix
            lineColor = linesMatrice[c][i][2];
            //temporary fix
  
            //X - bottom
            alternativeContext.strokeStyle = lineColor;
            alternativeContext.stroke();
          }
  
          alternativeContext.save();
          alternativeContext.fillStyle = "black";
          alternativeContext.font = "10px " + fontFamily;
          alternativeContext.translate(x - 2 - (xOffset / 2) * Math.cos(textAngle * Math.PI / 180), canvasHeight - yOffset + 2 + (yOffset/2) * Math.abs(Math.cos(textAngle * Math.PI / 180)));
          alternativeContext.rotate(textAngle * Math.PI / 180);
          alternativeContext.fillText(linesMatrice[c][i][3], 0, 0);
          alternativeContext.restore();
        }
      }
      array[parseInt(c)+1] = [alternativeCanvas, lineColor];
    }
    array[0] = [canvas, "mainCanvas"];
  } else {
    context.font = "20px " + fontFamily;
    if(isDarkRGB(colorArray(backgroundColor))){
      var strokeColor = "rgba(255,255,255,0.3)";
    } else {
      var strokeColor = "rgba(0,0,0,0.3)";
    }
    context.strokeStyle = strokeColor;
    context.fillText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);
    context.strokeText(noDataString, canvasWidth/2 - xOffset * 2, canvasHeight/2);

    array[1] = [canvas, "mainCanvas"];
  }
  

  return array;
}

function dataInWeb(dataMatrice, backgroundColor = "rgb(255,255,255)", canvasWidth = 300, xOffset = 15, fontFamily = "verdana"){
  let canvas = document.createElement("canvas");
  if(isEven(canvasWidth)){
    canvasWidth += 1;
  }
  let halfWidth = Math.ceil(canvasWidth / 2);
  let maxRadius = halfWidth - xOffset;
  canvas.width = canvasWidth;
  canvas.height = canvasWidth;
  let context = canvas.getContext("2d");

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  let highestY = 0;
  let lastX = undefined;
  let lastY = undefined;
  let firstX = undefined;
  let firstY = undefined;
  let mainDrawing = true;
  let matriceArrays = [];
  let matriceRef = 0;
  let matriceCounter = 0;
  let xComponent = 0;
  let yComponent = 0;
  let xC = 0;
  let xCa = 0;
  let yC = 0;
  let yCa = 0;
  
  context.translate(halfWidth, halfWidth);
  context.rotate(-90 * Math.PI / 180);
  context.translate(-halfWidth, -halfWidth);

  for(let i =  0; i < dataMatrice.length; i++){
    if(mainDrawing){
      let angle = dataMatrice[i][0];
      context.beginPath();
      context.moveTo(halfWidth, halfWidth);
      
      xComponent = Math.cos(angle * Math.PI / 180) + 1;
      yComponent = Math.sin(angle * Math.PI / 180) + 1;
      xComponent = xComponent * maxRadius - ((xComponent - 2) * xOffset);
      yComponent = yComponent * maxRadius - ((yComponent - 2) * xOffset);
      
      context.lineWidth = 0.5;
      context.strokeStyle = "lightgrey"
      context.lineTo(xComponent, yComponent);
      context.stroke();
      
      if(lastX != undefined && lastY != undefined){
        context.lineTo(lastX, lastY);
        context.stroke();
      }
      
      if(firstX == undefined && firstY == undefined){
        firstX = xComponent;
        firstY = yComponent;
      }
      
      lastX = xComponent;
      lastY = yComponent;
      
      if(dataMatrice[i][3] == "breakData"){
        mainDrawing = false;
      }
    }
    
    if(dataMatrice[i][1] > highestY){
      highestY = dataMatrice[i][1];
    }
    
    if(dataMatrice[i][3] == "breakData"){
      matriceArrays[matriceCounter] = [];
      for(let j = 0; j <= (i - matriceRef); j++){
        matriceArrays[matriceCounter][j] = dataMatrice[j + matriceRef];
      }
      matriceRef = i + 1;
      matriceCounter++;
    }
  }
  context.moveTo(xComponent, yComponent);
  context.lineTo(firstX, firstY);
  context.stroke();
  
  for(let i = 0; i < matriceArrays.length; i++){
    context.beginPath();
    let lineColor = undefined;
    let lastXc = undefined;
    let lastYc = undefined;
    let startXc = undefined;
    let startYc = undefined;
    for(let j = 0; j < matriceArrays[i].length; j++){
      if(lineColor == undefined){
        lineColor = matriceArrays[i][j][2];
      }
    
      let angleRef = matriceArrays[i][j][0];
      
      xCa = Math.cos(angleRef * Math.PI / 180);
      yCa = Math.sin(angleRef * Math.PI / 180);
      xC = xCa * matriceArrays[i][j][1] * (maxRadius - xOffset) / highestY;
      yC = yCa * matriceArrays[i][j][1] * (maxRadius - xOffset) / highestY;
      xC += halfWidth;
      yC += halfWidth;
      
      if(startXc == undefined && startYc == undefined){
        startXc = xC;
        startYc = yC;
      }
      
      context.lineWidth = 1;
      context.strokeStyle = lineColor;  
      if(lastXc == undefined && lastYc == undefined){
        context.moveTo(xC, yC);
      } else {
        context.lineTo(xC, yC);
      }
      
      lastXc = xC;
      lastYc = yC;
        
      if(j == matriceArrays[i].length - 1){
        context.lineTo(startXc, startYc);
      }
    }
    context.stroke();
  }
  return canvas;
}

function randomColor(){
  let color = "rgb(" + Math.round(randomNumber(0,254)) + "," + Math.round(randomNumber(0,254)) + "," + Math.round(randomNumber(0,254)) + ")";
  return color;
}

function randomNumber(min, max){
  return ((Math.random() * max) + min);
}

function isEven(n) {
  return n % 2 == 0;
}

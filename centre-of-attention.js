var indices = [];
var visited = {};
var results = {
  1: []
};

function getBoundary(width, height, pixels, color, dp) {
  var length = width * height;

  for (var index = 0; index < length; index++) {
    if (pixels[index] !== color) continue;

    var top = index - width;
    var right = (index % width) + 1;
    var bottom = index + width;
    var left = (index % width) - 1;
    
    if (top < 0 || bottom >= length || left < 0 || right >= width) {
      dp[index] = 1;
      visited[index] = true;
      results[1].push(index);
      continue;
    }

    if (pixels[top] !== color ||
        pixels[index - 1] !== color ||
        pixels[bottom] !== color ||
        pixels[index + 1] !== color) {
      dp[index] = 1;
      visited[index] = true;
      results[1].push(index);
      continue;
    }

    indices.push(index);
  }
}

function calcMinDepth(width, dp) {
  var maxDepth = 1;

  while (indices.length !== 0) {
    let newVisited = {};
    let newIndices = [];
    for (let index of indices) {
      let top = index - width;
      let right = index + 1;
      let bottom = index + width;
      let left = index - 1;
      let depths = [top, right, bottom, left].filter((direction) => !!visited[direction]);
      
      if (depths.length === 0) {
        newIndices.push(index);
        continue;
      }

      depths = depths.map((direction) => dp[direction]);
      dp[index] = Math.min.apply(Math, depths) + 1;
      newVisited[index] = true;
      maxDepth = dp[index] > maxDepth ? dp[index] : maxDepth;
      if (results.hasOwnProperty(dp[index])) {
        results[dp[index]].push(index);
      } else {
        results[dp[index]] = [index];
      }
    }
    Object.assign(visited, newVisited);
    indices = newIndices;
  }
}

onmessage = function(e) {
  const { width, height, pixels, color, dp, next } = e.data;
  if (next === 1) {
    getBoundary(width, height, pixels, color, dp);
  } else {
    calcMinDepth(width, dp);
  }
  postMessage(dp);
}

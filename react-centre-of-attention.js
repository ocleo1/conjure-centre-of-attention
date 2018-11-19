const color = {
  33: 'blue',
  34: 'orange'
};
const pixels = [
  34, 34, 34, 34, 34, 34, 34, 34, 34, 34,
  33, 34, 34, 34, 34, 34, 34, 34, 34, 34,
  33, 33, 34, 34, 34, 34, 34, 34, 34, 34,
  33, 33, 33, 34, 34, 34, 34, 34, 34, 34,
  33, 33, 33, 33, 34, 34, 34, 34, 34, 34,
  33, 33, 33, 33, 33, 34, 34, 34, 34, 34,
  33, 33, 33, 33, 33, 33, 34, 34, 34, 34,
  33, 33, 33, 33, 33, 33, 33, 34, 34, 34,
  33, 33, 33, 33, 33, 33, 33, 33, 34, 34,
  33, 33, 33, 33, 33, 33, 33, 33, 33, 34
];
const width = 10;
const height = 10;
const colour = 34;

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dp: new Array(width * height).fill(-1)
    };
  }

  componentDidMount() {
    var indices = [];
    var length = width * height;
    var dp = new Array(length).fill(-1)
    var visited = {};
    var results = {
      1: []
    };

    for (var index = 0; index < length; index++) {
      if (pixels[index] !== colour) continue;

      let top = index - width;
      let right = (index % width) + 1;
      let bottom = index + width;
      let left = (index % width) - 1;
      
      if (top < 0 || bottom >= length || left < 0 || right >= width) {
        dp[index] = 1;
        visited[index] = true;
        results[1].push(index);
        continue;
      }

      if (pixels[top] !== colour ||
          pixels[index - 1] !== colour ||
          pixels[bottom] !== colour ||
          pixels[index + 1] !== colour) {
        dp[index] = 1;
        visited[index] = true;
        results[1].push(index);
        continue;
      }

      indices.push(index);
    }

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

    this.setState({
      dp: dp
    });
  }

  render() {
    return (
      <div>
        {
          new Array(height).fill(0).map((item, rowIndex) => {
            let row = new Array(width).fill(0).map((i, colIndex) => {
              let index = rowIndex * width + colIndex;
              return (
                <div
                  key={index}
                  style={{
                    display: 'inline-block',
                    lineHeight: '30px',
                    width: 30,
                    height: 30,
                    marginLeft: 5,
                    background: color[pixels[index]],
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  {this.state.dp[index]}
                </div>
              );
            })

            return row.concat([<br key={'br' + rowIndex} />]);
          })
        }
      </div>
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('root')
);

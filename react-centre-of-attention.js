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
    pixels.forEach((pixel, index) => {
      if (pixel === colour) {
        indices.push(index);
      }
    });
    var length = width * height;
    var dp = new Array(length).fill(-1)
    var visited = {};

    for (let index of indices) {
      let top = index - width;
      let right = (index % width) + 1;
      let bottom = index + width;
      let left = (index % width) - 1;
      
      if (top < 0 || bottom >= length || left < 0 || right >= width) {
        dp[index] = 1;
        visited[index] = true;
        continue;
      }
  
      if (pixels[top] !== colour ||
          pixels[index - 1] !== colour ||
          pixels[bottom] !== colour ||
          pixels[index + 1] !== colour) {
        dp[index] = 1;
        visited[index] = true;
      }
    }

    var rest = indices.filter((index) => dp[index] === -1);
    while (rest.length !== 0) {
      let newVisited = {};
      for (let index of rest) {
        let top = index - width;
        let right = index + 1;
        let bottom = index + width;
        let left = index - 1;
        let depths = [top, right, bottom, left].filter((direction) => !!visited[direction]);
        
        if (depths.length === 0) {
          continue;
        }

        depths = depths.map((direction) => dp[direction]);
        dp[index] = Math.min.apply(Math, depths) + 1;
        newVisited[index] = true;
      }
      Object.assign(visited, newVisited);
      rest = rest.filter((index) => dp[index] === -1);
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

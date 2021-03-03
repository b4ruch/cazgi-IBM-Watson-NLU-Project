import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
  render() {
    return (
      <div>
        {/*You can remove this line and the line below. */}
        {/* {JSON.stringify(this.props.emotions)} */}
        <table className="table table-bordered">
          <tbody>
            {
              //-------Write code to use the .map method that you worked on in the Hands-on React lab to extract the emotions

              //Converts emotions object into an array where each element is another array whose elements are the key and property
              Object.entries(this.props.emotions).map((emotion, index) => {
                return (
                  <tr key={index}>
                    {
                      emotion.map((el, index) => {
                        return <td key={index}>{el}</td>
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
export default EmotionTable;

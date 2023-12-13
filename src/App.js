import React, { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecogntion';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import './App.css';
// import Clarifai from 'clarifai';


// const app = new Clarifai.App({
//  apiKey: 'b35794670d9742779261120f884bdf96'
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

// const returnClarifaiRequestOptions = (imageUrl) => {
//   const PAT = 'a6e8a27d57fc41e68da061d6b1b8399f';
//   const USER_ID = 'dalla88';       
//   const APP_ID = 'ZTMproject';
//   const IMAGE_URL = imageUrl;
//   const raw = JSON.stringify({
//       "user_app_id": {
//           "user_id": USER_ID,
//           "app_id": APP_ID
//       },
//       "inputs": [
//           {
//               "data": {
//                   "image": {
//                       "url": IMAGE_URL
//                   }
//               }
//           }
//       ]
//   });

//     const requestOptions = {
//       method: 'post',
//       headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Key ' + PAT
//       },
//       body: raw
//   };
//   return requestOptions;
// }

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState ({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  
  calculateFaceLocation = (result) =>{
    const boundingBox = result.outputs[0].data.regions[0].region_info.bounding_box;
            const image = document.getElementById('inputimage');
            const width = Number(image.width); 
            const height = Number(image.height);
            return {
              leftCol: boundingBox.left_col * width,
              topRow: boundingBox.top_row * height,
              rightCol: width - boundingBox.right_col * width,
              bottomRow: height - boundingBox.bottom_row * height,
            };
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    
    fetch('http://localhost:3000/clarifai-endpoint', { // Updated backend endpoint URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: this.state.input }), // Pass the image URL to backend
    })
    // fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, returnClarifaiRequestOptions(this.state.input))
      .then(response => response.json())
      .then(result => {
        if(result) {
          console.log('Clarifai Response from Backend:', result);
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Updating image count failed');
            })
            .then(count => {
              console.log('Entries Count:', count);
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(error => console.log(`Error updateing image count:`, error));
        }
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch(error => console.log('Error processing Claraifai response:', error));
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  }

  render() {
    return (
      <div className="App">
        <>
          <div>...</div>
          <ParticlesBg color='#fc46aa' num={200} type="cobweb" bg={{
            position: "absolute",
            zIndex: -2,
            top: 0,
            left: 0
        }} />
        </>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
          ? <div>
          <Logo />     
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
         : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange= {this.onRouteChange} />
            : <Register loadUser= {this.loadUser} onRouteChange= {this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;



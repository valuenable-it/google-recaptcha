# react-google-recaptcha3
React service for Google reCAPTCHA 3

See [Demo](https://stackblitz.com/edit/react-google-recaptcha3?file=src/App.js)

# Installation

Run following command to install react-google-recaptcha3

```sh
npm i react-google-recaptcha3
```

# How to use?
reCAPTCHA v3 introduces a new concept: **actions**. When you specify an action name in each place you execute reCAPTCHA you enable two new features:

- a detailed break-down of data for your top ten actions in the [admin console](https://g.co/recaptcha/admin)
- adaptive risk analysis based on the context of the action (abusive behavior can vary)
Importantly, when you verify the reCAPTCHA response you should also verify that the action name matches the one you expect.

## Front
At first you need to import ```ReactRecaptcha3``` to your component

```sh
import ReactRecaptcha3 from 'react-google-recaptcha3';
```


Pass your siteKey in `useEffect` hook

```
  useEffect(() => {
    ReactRecaptcha3.init(YOUR_SITE_KEY)    
  }, [])
```

The `init` function will return Promise with `status` parameter that will indicate script loaded status
```
  useEffect(() => {   
    ReactRecaptcha3.init(YOUR_SITE_KEY).then(status => {
      // status: success/error
      // success - script is loaded and greaptcha is ready
      // error - script is not loaded
      console.log(status)
    })
   }, [])
```

On form submit generate recaptcha token (it will be checked in backend) using *siteKey*

```

 const handleSubmit = () => {
    ReactRecaptcha3.getToken().then(token => {
      console.log(token)
      // send token with form data
      // dataToSend.token = token
      // fetch(url, { method: 'POST', body: JSON.stringify(dataToSend) })
    }, error => {
      // handle error here
      console.log(error)      
    })
  }
```

Execute `getToken` with action name. See more [here](https://developers.google.com/recaptcha/docs/v3#actions)
``` 
ReactRecaptcha3.getToken({ action: 'homepage' })
``` 

Destroy recaptcha 
```
  ReactRecaptcha3.destroy()
```

## Backend
In backend we need to verify given token using secretKey.
### node.js example
```
const request = require('request-promise');

 const secretKey = YOUR_RECAPTCHA_SECRET_KEY;
 const userIp = 'USER_IP';
     request.get(
        {
            url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
        }).then((response) => {

        // If response false return error message
        if (response.success === false) {
            return res.json({success: false, error: 'Recaptcha token validation failed'});
        }
        // otherwise continue handling/saving form data
        next();
    })
```

### PHP example
```
$recaptchaToken = isset($_POST['recaptchaToken']) ? $_POST['recaptchaToken'] : false;

  if(!$recaptchaToken) {
    //Do something with error
  }
  
  $secretKey = YOUR_RECAPTCHA_SECRET_KEY;
  $userIp = $_SERVER['REMOTE_ADDR'];
  $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$recaptchaToken."&remoteip=".$userIp);
  
  if($response.success == false){
       //Do something with error
              
  } else {
    // reCaptchaToken is valid you can continue with the rest of your code
  }
```

# ajax-multi-file-uploader
Scalable Multi File Uploader built with Native JS and Promises

Designed as portable solution that meets these requirements:
* Multiple file selection
* Mobile friendly
* AJAX upload
* Progress indicators
* Support large batch uploads, for example 20-30 photo files; led to a requirement for sequential file uploads
* No framework or plugin dependencies, strictly native JavaScript

## Sequential AJAX Requests

Through use of AsyncSequenceIterator Object, ensures each AJAX file upload request finishes before the next request beings (essentially force files to be uploaded in a sequential fashion).

![alt text](https://taylor.callsen.me/wp-content/uploads/2018/08/simple-multi-file-sequential-ajax.jpg)

## More Information
See this blog post for more information on the features and JavaScript logic: 

https://taylor.callsen.me/ajax-multi-file-uploader-with-native-js-and-promises/

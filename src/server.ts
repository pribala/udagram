import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { CustomError } from './interface/customerror';
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  // public image urls for testing
  // https://www.gstatic.com/webp/gallery/2.jpg
  // https://www.gstatic.com/webp/gallery/1.jpg
  app.get( "/filteredimage", async ( req: express.Request, res: express.Response) => {
    // get the image url from request object
    const image_url: string = req.query.image_url;
    // create custom error message
    let customError: CustomError = {
      errCode: 400, 
      errMessage: 'Please provide a valid url.'
    }; 
    // validate url and show error message if url is invalid
    if (!image_url) {
      return res.status(customError.errCode)
                  .send(customError.errMessage);
    }
    try {
      // call filterImageFromURL(image_url) to filter the image
      const filePath: string = await filterImageFromURL(image_url);
      // send the resulting file in the response &
      // delete any files on the server on finish of the response
      res.sendFile(filePath, () => {deleteLocalFiles([filePath])});
    } catch(err) {
      res.status(err.errCode).send(err.errMessage);
    }

  } );


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res: express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
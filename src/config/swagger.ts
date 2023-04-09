import {Express , Request , Response} from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options:swaggerJSDoc.Options = {
    definition:{
        openapi: '3.0.0',
        info:{
            title: 'API',
            version: '1.0.0',
            description: 'API'
        },
     },
     apis: ['./src/routes/**/*.ts']
    
}

const swaggerspec = swaggerJsdoc(options);

function swaggerDocs (app:Express)   {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerspec));

    app.use('/docs.json', (req:Request, res:Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerspec);
    })
}


export default swaggerDocs;

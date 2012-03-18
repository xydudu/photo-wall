###
    Ok, Here We go.
###

express = require "express"
request = require "request"

app = express.createServer()

app.set 'view engine', 'jade'
app.set 'views', __dirname + '/views'

app.use express.static( __dirname + '/statics' )
app.use express.bodyParser()
app.use express.cookieParser()

app.get '/api/list*', ( req, res )->
    #url = 'http://faxianla.com/mark/board.jsn?boardId=9344&offset=0&_=1331822332245'
    url = 'http://faxianla.com/mark/popular.jsn?offset=0&_=1332062171115'
    
    request.get url, ( $err, $res, $body )->
        data = JSON.parse( $body )
        json = []
        for i in data.data
            info =
                intro: i.title
                src: i.image_url

            key = new Buffer( JSON.stringify( info ), 'utf-8' ).toString 'base64'

            json.push(
                id: key.replace( /\//gi, '|#|' )
                intro: i.title
                src: i.image_url
            )
        res.send json

app.get '/api/view/:key', ( req, res )->

    key = req.params.key.replace( /\|\#\|/gi, '/' )
    key = new Buffer( key, 'base64' ).toString 'utf-8'
    info = JSON.parse key
    info.src = info.src.replace 'metal', 'wood'
    res.send info
    
app.get '/', ( req, res )->
    res.render 'index', layout: false

app.listen '8888'



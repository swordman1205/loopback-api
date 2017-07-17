'use strict';

module.exports = function(Remotefile) {
  var AWS = require('aws-sdk');

  Remotefile.on('attached', function () {
    AWS.config.update({
      accessKeyId: Remotefile.app.get('amazonKeyId'),
      secretAccessKey: Remotefile.app.get('amazonKeySecret')
    });

    AWS.config.region = "us-east-1";
  });

  Remotefile.preview = function(cb) {
    var PDFImage = require("pdf-image").PDFImage;
    var pdfImage = new PDFImage("https://cooksystem.s3.amazonaws.com/tmp_bgk6qb4sg/Documentacio%CC%81_curs_ios.pdf");
    pdfImage.convertPage(0).then(function (imagePath) {
      // 0-th page (first page) of the slide.pdf is available as slide-0.png
      fs.existsSync("./storage/slide-0.png") // => true
    });

    cb();
  }

  function addSuffix(fileName, suffix) {
    var fileExt = fileName.split('.').pop();
    var fileName = fileName.substr(0, fileName.lastIndexOf('.'));
    var newName = fileName + "." + suffix + "." + fileExt;

    return newName;
  }

  function baseName(str) {
     var base = new String(str).substring(str.lastIndexOf('/') + 1);
      //if(base.lastIndexOf(".") != -1)
      //    base = base.substring(0, base.lastIndexOf("."));
     return base;
  }

  function baseUrl(str) {
     var base = new String(str).substring(0,str.lastIndexOf('/'));
      //if(base.lastIndexOf(".") != -1)
      //    base = base.substring(0, base.lastIndexOf("."));
     return base;
  }

  Remotefile.uploadAvatar = function (ctx, options, cb) {
    var newName = addSuffix(file.name, ts);
    var fs = require('fs-extra');
    var workingDir = 'storage/' + ctx.req.params.container + "/";

    fs.readFile(workingDir + newName, function(err, buffer) {
      var s3obj = new AWS.S3({
        params: {
          Bucket: 'cooksystem',
          Key: ctx.req.query.destination + "/" + newName,
          ContentType: file.type,
          ACL: 'public-read',
          Body: buffer
        }
      })

      s3obj.upload().send(function(err,data) {
        response.push({
          label: file.name,
          //value: data.Location //data.key?
          value: {
            key: data.key,
            url: data.Location,
            thumbnail: baseUrl(data.Location) + "/" + baseName(imagePath)
          }
        });

        //console.log(response);
        if (index == arr.length-1) {
          //fs.remove(workingDir);
          cb(null, response);
        }
      });
    });
  }


  Remotefile.upload = function (ctx,options,cb) {
      if(!options) options = {};

      ctx.req.params.container = ctx.req.query.container;
      Remotefile.app.models.Container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
          if(err) {
              cb(err);
          } else {
            var response = [];
            var files = fileObj.files.file;
            var fs = require('fs-extra');

            var calls = [];
            files.forEach(function(file, index, arr) {
              var ts = Date.now() / 1000 | 0;
              var newName = addSuffix(file.name, ts);
              var workingDir = 'storage/' + ctx.req.params.container + "/";

              fs.move(workingDir + file.name, workingDir + newName, function(err) {
                if (!err) {
                  //create preview
                  var PDFImage = require("pdf-image").PDFImage;
                  var pdfImage = new PDFImage('storage/' + ctx.req.params.container + '/' + newName);
                  pdfImage.convertPage(0).then(function (imagePath) {

                    //upload the thumbnail
                    fs.readFile(workingDir + baseName(imagePath), function(err, buffer_th) {
                      var s3obj_th = new AWS.S3({
                        params: {
                          Bucket: 'cooksystem',
                          Key: ctx.req.query.destination + "/" + baseName(imagePath),
                          ContentType: "image/png",
                          ACL: 'public-read',
                          Body: buffer_th
                        }
                      });

                      s3obj_th.upload().send(function(err,data) {});
                    });

                    //upload the file
                    fs.readFile(workingDir + newName, function(err, buffer) {
                      var s3obj = new AWS.S3({
                        params: {
                          Bucket: 'cooksystem',
                          Key: ctx.req.query.destination + "/" + newName,
                          ContentType: file.type,
                          ACL: 'public-read',
                          Body: buffer
                        }
                      })

                      s3obj.upload().send(function(err,data) {
                        response.push({
                          label: file.name,
                          //value: data.Location //data.key?
                          value: {
                            key: data.key,
                            url: data.Location,
                            thumbnail: baseUrl(data.Location) + "/" + baseName(imagePath)
                          }
                        });

                        //console.log(response);
                        if (index == arr.length-1) {
                          //fs.remove(workingDir);
                          cb(null, response);
                        }
                      });
                    });


                  });
                }
              });
            });
          }
      });
  };

  Remotefile.remoteMethod(
      'upload',
      {
          description: 'Uploads files',
          accepts: [
              { arg: 'ctx', type: 'object', http: { source:'context' } },
              { arg: 'options', type: 'object', http:{ source: 'query'} }
          ],
          returns: {
              arg: 'fileObject', type: 'object', root: true
          },
          http: {verb: 'post'}
      }
  );

  Remotefile.remoteMethod(
      'uploadAvatar',
      {
          description: 'Uploads a single file',
          accepts: [
              { arg: 'ctx', type: 'object', http: { source:'context' } },
              { arg: 'options', type: 'object', http:{ source: 'query'} }
          ],
          returns: {
              arg: 'fileObject', type: 'object', root: true
          },
          http: {verb: 'post'}
      }
  );

  Remotefile.remoteMethod(
      'preview',
      {
        http: {verb: 'get'},
        returns: {arg: 'status', type: 'string'}
      }
  );
};

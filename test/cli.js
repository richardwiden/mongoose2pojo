"use strict";

var spawn = require('child_process').spawn;
var fs = require('fs');

describe("CLI", function () {
  it("should convert files", function (done) {
    var expectedFile = __dirname + "/files/ImagePojo.java";

    fs.unlink(expectedFile);
    var proc = spawn(__dirname + "/../bin/mongoose2pojo", [__dirname + "/files/image-schema.js"], { stdio: 'inherit' });

    proc.on('close', function (code) {
      if (code) {
        done("mongoose2pojo CLI finished with error " + code);
      } else {
        if (!fs.existsSync(expectedFile)) {
          done("Expected file not found: " + expectedFile)
        } else {
          done();
        }
      }
    });
  });
});
"use strict";

var spawn = require('child_process').spawn;
var fs = require('fs');

describe("CLI", function () {
  it("should convert files with given collection name", function (done) {
    var expectedFile = __dirname + "/files/MyimagePojo.java";

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

  it("should convert files without collection name", function (done) {
    var expectedFile = __dirname + "/files/UserPojo.java";

    fs.unlink(expectedFile);
    var proc = spawn(__dirname + "/../bin/mongoose2pojo", [__dirname + "/files/user-schema.js"], { stdio: 'inherit' });

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
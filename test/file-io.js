"use strict";
var m2p = require("../");

describe("file IO", function () {
  it("should read existing file", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parseFile("./test/files/image.js");

    text.should.startWith("public class Image{\n");
    text.should.endWith("}\n");
    text.should.containEql("public String getType()");
    text.should.containEql("public void setType(String type)");
    text.should.containEql("public Date getTime()");
    text.should.containEql("public void setTime(Date time)");
    text.should.containEql("public UUID getRef()");
    text.should.containEql("public void setRef(UUID ref)");
  });
});
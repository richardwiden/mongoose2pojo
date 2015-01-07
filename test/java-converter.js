'use strict';
var m2p = require("../");
var Schema = require("mongoose").Schema;

describe("converter", function () {
  it("should put header and footer", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parse({ });

    text.should.containEql("public class Image{\n");
    text.should.endWith("}\n");
  });

  it("should set id type to UUID", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parse({ });

    text.should.containEql("public UUID getId()");
    text.should.containEql("public void setId(UUID id)");
  });

  it("should insert getters/setters body", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parse({
      name:      { type: String, required: true },
      timestamp: { type: Date, required: false },
      lossless:  { type: Boolean, required: false },
      size:      { type: Number, required: true },
      data:      { type: Buffer, required: true }
    });

    text.should.containEql("return this.name;");
    text.should.containEql("this.name = name;");
    text.should.containEql("return this.timestamp;");
    text.should.containEql("this.timestamp = timestamp;");
    text.should.containEql("return this.lossless;");
    text.should.containEql("this.lossless = lossless;");
    text.should.containEql("return this.size;");
    text.should.containEql("this.size = size;");
    text.should.containEql("return this.data;");
    text.should.containEql("this.data = data;");
  });

  it("should parse basic types", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parse({
      name:      { type: String, required: true },
      timestamp: { type: Date, required: false },
      lossless:  { type: Boolean, required: false },
      size:      { type: Number, required: true },
      data:      { type: Buffer, required: true }
    });

    text.should.containEql("public String getName()");
    text.should.containEql("public void setName(String name)");
    text.should.containEql("public Date getTimestamp()");
    text.should.containEql("public void setTimestamp(Date timestamp)");
    text.should.containEql("public boolean getLossless()");
    text.should.containEql("public void setLossless(boolean lossless)");
    text.should.containEql("public byte[] getData()");
    text.should.containEql("public void setData(byte[] data)");
  });

  it("should parse Array type", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parse({
      sizes:     { type: [Number], required: true }
    });

    text.should.containEql("public double[] getSizes()");
    text.should.containEql("public void setSizes(double[] sizes)");
  });

  it("should parse Mixed type", function () {
    var parser = m2p({
      className: "Image"
    });

    var text = parser.parse({
      resized:   { type: Schema.Types.Mixed, default: {}}
    });

    text.should.containEql("public Map<String, Object> getResized()");
    text.should.containEql("public void setResized(Map<String, Object> resized)");
  });
});
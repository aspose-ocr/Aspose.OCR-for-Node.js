const Module = require("./lib/asposeocr");
var fs = require("fs");

Module.onRuntimeInitialized = async _ => {
	fs.readFile("source.png", (err, imageData) => {
		const imageBytes = new Uint8Array(imageData);
		let internalFileName = "temp";
		let stream = Module.FS.open(internalFileName, "w+");
		Module.FS.write(stream, imageBytes, 0, imageBytes.length, 0);
		Module.FS.close(stream)
;
		let source = Module.WasmAsposeOCRInput();
		source.url = internalFileName;
		let batch = new Module.WasmAsposeOCRInputs();
		batch.push_back(source);
		let recognitionSettings = Module.WasmAsposeOCRRecognitionSettings();
		recognitionSettings.language_alphabet = Module.Language.ENG;
		var result = Module.AsposeOCRRecognize(batch, recognitionSettings);
		var text = Module.AsposeOCRSerializeResult(result, Module.ExportFormat.text);
		console.log(text);
	});
}
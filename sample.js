const Module = require("./path/to/module/asposeocr");
var fs = require('fs');

Module.onRuntimeInitialized = async _ =>  
{
	fs.readFile('path/to/lic/file.lic', function (err, lic_data) {
		if (err) {
		throw err; 
		}
		const fileData = new Uint8Array(lic_data);
		Module.AsposeOCRSetLicenseFromData(fileData);
		console.log("license is setted " + Module.AsposeOCRGetState());

		fs.readFile('path/to/img/file.png', function (err, img_data) {
			if (err) {
				throw err; 
			}
			const fileData = new Uint8Array(img_data);
			let filename = "my_file_name";
			let stream = Module.FS.open(filename, 'w+');
			Module.FS.write(stream, fileData, 0, fileData.length, 0);
			Module.FS.close(stream)
;

			var input = Module.WasmAsposeOCRInput();
			var inputs = new Module.WasmAsposeOCRInputs();
			var settings = Module.WasmAsposeOCRRecognitionSettings();
			settings.detect_areas_mode = Module.DetectAreasMode.DOCUMENT;
			input.url = filename;
			inputs.push_back(input);
			var result = Module.AsposeOCRRecognize(inputs, settings);
			var result_str = Module.AsposeOCRSerializeResult(result, Module.ExportFormat.text);
			console.log(result_str);
		});
	});
}
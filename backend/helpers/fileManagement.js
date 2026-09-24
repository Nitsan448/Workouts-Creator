const fs = require("fs");
const multer = require("multer");
const path = require("path");

const IMAGES_DIRECTORY = path.join(__dirname, "..", "images");

const fileStorage = multer.diskStorage({
	destination: IMAGES_DIRECTORY,
	filename: function (req, file, cb) {
		const fileName = new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
		// Routes read the public URL from file.location, as multer-s3 used to provide it.
		file.location = `${process.env.API_URL}/images/${encodeURIComponent(fileName)}`;
		cb(null, fileName);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const limits = { fileSize: 10 * 1024 * 1024 };
const multerSettings = { storage: fileStorage, fileFilter: fileFilter, limits: limits };

async function replaceImage(uploadedImages, oldImage) {
	let image;
	const imageUploaded = uploadedImages.length > 0;

	if (!imageUploaded) {
		image = oldImage;
	} else if (oldImage) {
		await deleteImage(oldImage);
		image = uploadedImages[0].location;
	} else {
		image = uploadedImages[0].location;
	}

	return image;
}

async function deleteImage(image) {
	await fs.promises.rm(path.join(IMAGES_DIRECTORY, getImageKey(image)), { force: true });
}

function getImageKey(imageUrl) {
	return decodeURIComponent(imageUrl.split("/").pop());
}

module.exports = { replaceImage, deleteImage, multerSettings, IMAGES_DIRECTORY };

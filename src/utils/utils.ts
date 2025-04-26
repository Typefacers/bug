import cockroachImg from "../assets/cockroach.png";
import flyImg from "../assets/fly.png";
import ladybugImg from "../assets/ladybug.png";
import spiderImg from "../assets/spider.png";
import antImg from "../assets/ant.png";
import beetleImg from "../assets/beetle.png";
import caterpillarImg from "../assets/caterpillar.png";
import mothImg from "../assets/moth.png";
import mosquitoImg from "../assets/mosquito.png";
import brownBeetleImg from "../assets/brown-beetle.png";

// Array of all bug images
const bugImages = [cockroachImg, flyImg, ladybugImg, spiderImg, antImg, beetleImg, caterpillarImg, mothImg, mosquitoImg, brownBeetleImg];

// Get a random bug image based on bug id
export const getBugImage = (id: string) => {
	// Use the bug ID to consistently get the same image for the same bug
	const index = id.charCodeAt(id.length - 1) % bugImages.length;
	return bugImages[index];
};

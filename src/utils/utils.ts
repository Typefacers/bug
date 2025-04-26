import cockroachImg from "../assets/cockroach-min.png";
import flyImg from "../assets/fly-min.png";
import ladybugImg from "../assets/ladybug-min.png";
import spiderImg from "../assets/spider-min.png";
import antImg from "../assets/ant-min.png";
import beetleImg from "../assets/beetle-min.png";
import caterpillarImg from "../assets/caterpillar-min.png";
import mothImg from "../assets/moth-min.png";

// Array of all bug images
const bugImages = [cockroachImg, flyImg, ladybugImg, spiderImg, antImg, beetleImg, caterpillarImg, mothImg];

// Get a random bug image based on bug id
export const getBugImage = (id: string) => {
	// Use the bug ID to consistently get the same image for the same bug
	const index = id.charCodeAt(id.length - 1) % bugImages.length;
	return bugImages[index];
};
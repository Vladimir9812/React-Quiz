import axios from "axios";

export default axios.create({
	baseURL: 'https://react-quiz-c12b7-default-rtdb.firebaseio.com/'
});
import { qs } from "../libs"
import { Calendar } from "./Calendar"

export const Ui = async () =>{
	await Calendar.load()
	Calendar.init()
}
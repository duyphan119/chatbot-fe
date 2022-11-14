import { memo, useState } from "react";
import { Box, Typography, Container, Avatar, Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
const apiCaller = axios.create({
	baseURL: "http://localhost:8080/api",
});
function App() {
	const [state, setState] = useState({
		messages: [
			{
				id: new Date().getTime(),
				text: "Chào bạn, tôi là Bot.",
				isBot: true,
			},
		],
		text: "",
	});
	const { messages, text } = state;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setState((prev) => ({
			...prev,
			messages: [{ id: new Date().getTime(), text, isBot: false }, ...prev.messages],
			text: "",
		}));
		try {
			const res = await apiCaller.post("message", { message: text });
			const { data } = res.data;
			setState((prev) => ({
				...prev,
				messages: [{ ...data, isBot: true }, ...prev.messages],
				text: "",
			}));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
			<Box
				sx={{
					fontSize: 14,
					backgroundColor: "#f3f3f3",
					height: "calc(100vh - 1px)",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						fontSize: 24,
						backgroundColor: "#5d51e3",
						padding: "16px",
						color: "#fff",
					}}
				>
					CHAT WITH BOT
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column-reverse",
						overflowY: "auto",
						px: 1,
						width: "50vw",
						flex: 1,
					}}
					className="custom-scrollbar"
				>
					{messages.map((message) => {
						return <Message message={message} key={message.id} />;
					})}
				</Box>
				<Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
					<Box
						sx={{
							display: "flex",
							"& input": {
								flex: 1,
								padding: "4px",
								outline: "none",
							},
							"& button": {
								padding: "4px 12px",
								outline: "none",
								cursor: "pointer",
							},
						}}
					>
						<input value={text} onChange={(e) => setState((prev) => ({ ...prev, text: e.target.value }))} type="text" placeholder="Nhập tin nhắn" />
						<button
							disabled={text === ""}
							style={{
								backgroundColor: "#5d51e3",
								color: "#fff",
								borderColor: "#5d51e3",
							}}
						>
							Gửi
						</button>
					</Box>
				</Box>
			</Box>
		</Container>
	);
}

export default App;
const Message = memo(({ message: msg }) => {
	return (
		<Box
			sx={{
				my: 1,
				textAlign: msg.isBot ? "left" : "right",
			}}
		>
			<Tooltip title={moment(new Date()).format("DD-MM-yyyy hh:mm:ss")} placement="top">
				<Box sx={{ display: "inline-flex" }}>
					{msg.isBot && (
						<Avatar style={{ backgroundColor: "#fff" }} alt="Remy Sharp" src="https://avatars.githubusercontent.com/u/4723433?s=280&v=4" />
					)}
					<Box
						sx={{
							margin: msg.isBot ? "0 100px 0 8px" : "0 0 0 100px",
							backgroundColor: msg.isBot ? "#fff" : "#5d51e3",
							color: msg.isBot ? "#000" : "#fff",
							display: "inline-flex",
							padding: 1,
							borderRadius: "5px",
							alignItems: "center",
						}}
					>
						{msg.text}
					</Box>
				</Box>
			</Tooltip>
			{/* <Box>{moment(new Date()).format("DD-MM-yyyy hh:mm:ss")}</Box> */}
		</Box>
	);
});

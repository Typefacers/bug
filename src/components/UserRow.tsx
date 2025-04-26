import clsx from "clsx";
import { User } from "../mock/users";
import { useNavigate } from "react-router-dom";

interface Props {
	user: User;
	index: number;
}

export const UserRow: React.FC<Props> = ({ user, index }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/user/${user.id}`);
	};

	return (
		<div
			onClick={handleClick}
			className={clsx(
				"flex items-center justify-between rounded-lg border bg-white px-4 py-2 shadow-sm",
				index === 0 && "ring-2 ring-emerald-500",
				"cursor-pointer hover:bg-gray-50 transition-colors"
			)}
		>
			<span className="w-6 text-center font-mono text-sm">{index + 1}</span>
			<span className="flex-1 truncate text-sm font-medium">{user.name}</span>
			<span className="font-mono text-emerald-700">{user.score.toLocaleString()}</span>
		</div>
	);
};

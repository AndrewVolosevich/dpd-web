'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Cake } from 'lucide-react';
import { motion } from 'framer-motion';

interface BirthdayCelebrationProps {
	name: string;
	birthDate: string;
}

export default function BirthdayCelebration({
	name,
	birthDate,
}: BirthdayCelebrationProps) {
	const [showCelebration, setShowCelebration] = useState(true);

	useEffect(() => {
		const today = new Date();
		const birthday = new Date(birthDate);

		const isBirthday =
			today.getDate() === birthday.getDate() &&
			today.getMonth() === birthday.getMonth();

		setShowCelebration(isBirthday);
	}, [birthDate]);

	if (!showCelebration) return null;

	return (
		<div className="relative">
			<Confetti
				width={window.innerWidth}
				height={350}
				recycle={true}
				numberOfPieces={200}
				className={'absolute w-full'}
			/>
			<motion.div
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="my-6 p-8 rounded-lg bg-gradient-to-r from-[#E30037] via-[#8C0022] to-[#E30037] text-white shadow-xl"
			>
				<div className="flex flex-col items-center gap-4">
					<Cake className="w-12 h-12" />
					<h2 className="text-3xl font-bold text-center">
						С днем рождения, {name}!
					</h2>
					<p className="text-lg text-center opacity-90">
						Желаем вам прекрасного дня и успехов во всех начинаниях!
					</p>
				</div>
			</motion.div>
		</div>
	);
}

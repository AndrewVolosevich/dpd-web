import React, { useEffect, useRef, useState } from 'react';

type TimerProps = {
	timeLimit: number; // Время в минутах
	onTimeout: () => void; // Коллбэк при истечении времени
};

const CustomTimer: React.FC<TimerProps> = ({ timeLimit, onTimeout }) => {
	const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Перевод времени в секунды
	const isTimeoutCalled = useRef(false); // Флаг, предотвращающий повторный вызов onTimeout

	useEffect(() => {
		if (timeLeft <= 0) {
			if (!isTimeoutCalled.current) {
				isTimeoutCalled.current = true; // Устанавливаем флаг
				onTimeout(); // Вызываем коллбэк только один раз
			}
			return; // Останавливаем выполнение эффекта
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval); // Очищаем интервал при размонтировании
	}, [timeLeft, onTimeout]);

	// Форматирование оставшегося времени в минуты и секунды
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};

	return (
		<div className="text-left text-sm text-muted-foreground">
			Осталось времени:{' '}
			<span className="font-bold">{formatTime(timeLeft)}</span>
		</div>
	);
};

export default CustomTimer;

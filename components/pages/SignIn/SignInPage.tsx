'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';

const AboutPage = () => {
	const [tel, setTel] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const { login } = useAuth();

	const handleSubmit = () => {
		if (!!tel && !!password) {
			login({ tel, password });
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Вход в систему</CardTitle>
				<CardDescription>Введите ваши учетные данные для входа</CardDescription>
			</CardHeader>
			<CardContent>
				<div>
					<div className="space-y-4">
						<div className="space-y-2">
							{/*<label htmlFor="phone">Введите ваш номер телефона:</label>*/}
							{/*<input*/}
							{/*	type="tel"*/}
							{/*	id="phone"*/}
							{/*	name="phone"*/}
							{/*	pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"*/}
							{/*	placeholder="123-45-678"*/}
							{/*/>*/}
							<Label htmlFor="phone">Номер телефона</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="291234567 - 9 знаков"
								value={tel}
								onChange={(e) => setTel(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Пароль</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
					</div>
					<Button
						type="button"
						variant={'default'}
						className="w-full mt-6"
						onClick={handleSubmit}
					>
						Войти
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="link" size="sm">
					Забыли пароль?
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AboutPage;

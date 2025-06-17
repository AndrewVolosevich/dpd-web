'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RulesModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
	const categories = [
		'Работа с документами',
		'Производственные процессы',
		'Юридические вопросы',
		'Продажи и поддержка клиентов',
		'Маркетинг и реклама',
		'ИТ продукты (CRM, 1С, Аргис и др.)',
		'Кадровый документооборот',
		'Корпоративная культура, внутренние коммуникации',
		'Подбор и развитие персонала',
		'Компенсации и льготы',
		'Экономика и финансы',
		'Безопасность',
		'Идеи новых проектов для компании',
	];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Правила подачи вопроса</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 text-sm">
					<p>
						Любой сотрудник компании может задать вопрос или выйти с
						предложением к руководству компании. Для этого достаточно нажать
						кнопку «Задать вопрос».
					</p>

					<div>
						<h3 className="font-semibold mb-2">
							Заполните форму (поля для заполнения):
						</h3>
						<ul className="space-y-2 ml-4">
							<li>
								<strong>Напишите кратко вопрос</strong> - именно короткий
								лаконичный вопрос может привлечь внимание коллег
							</li>
							<li>
								<strong>Укажите сферу деятельности</strong> - к какой сфере
								относится ваш вопрос. Ниже находится подсказка с перечнем сфер
							</li>
							<li>
								<strong>Описание вопроса</strong> - здесь необходимо описать
								суть вопроса или предложения по изменениям. Если вы предлагаете
								идею, то необходимо описать зачем она нужна, кого коснется, а
								также какую выгоду она принесёт компании в будущем
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-2">
							Не знаете к какой сфере относится ваш вопрос? Ознакомьтесь с
							возможными вариантами:
						</h3>
						<ul className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-4 text-xs">
							{categories.map((category, index) => (
								<li key={index}>{category}</li>
							))}
						</ul>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<h3 className="font-semibold mb-2">Процесс рассмотрения:</h3>
						<ol className="space-y-1 ml-4">
							<li>После публикации вопрос отправляется на модерацию</li>
							<li>После модерации вопрос попадает на главную страницу</li>
							<li>
								Сотрудники могут ставить «лайки» и «дизлайки», а также
								комментировать и обсуждать вопрос
							</li>
						</ol>
					</div>

					<p className="text-center text-gray-600">
						По всем вопросам работы сервиса обращайтесь на единый адрес –{' '}
						<strong>portal@dpd.by</strong>
					</p>
				</div>

				<DialogFooter>
					<Button onClick={onClose} className="bg-primary hover:brightness-90">
						Закрыть
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

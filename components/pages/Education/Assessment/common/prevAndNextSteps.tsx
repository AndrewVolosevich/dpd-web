import {
	Assessment,
	AssessmentStatus,
	AssessmentType,
} from '@/types/assessment';
import { UserData } from '@/types/entities';

const getIsReadyForNextStep = (assessment: Assessment, user?: UserData) => {
	const lastYearUserReady =
		assessment?.goalsLastYear?.filter((goal) => goal?.employeeRating != null)
			.length >= 3;
	const lastYearSupervisorReady =
		assessment?.goalsLastYear?.filter((goal) => goal?.supervisorRating != null)
			.length >= 3;
	const nextYearReady = assessment?.goalsNextYear?.length >= 3;
	const competencyWithRatingUser = assessment?.competencies?.filter(
		(c) => c.employeeRating != null,
	);
	const competencyWithRatingSupervisor = assessment?.competencies?.filter(
		(c) => c.supervisorRating != null,
	);
	const competencyUserReady = assessment?.user?.roles?.some(
		(r) => r === 'SUPERVISOR',
	)
		? competencyWithRatingUser?.length >= 6
		: competencyWithRatingUser?.length >= 5;
	const competencySupervisorReady = assessment?.user?.roles?.some(
		(r) => r === 'SUPERVISOR',
	)
		? competencyWithRatingSupervisor?.length >= 6
		: competencyWithRatingSupervisor?.length >= 5;

	const recommendationsReady =
		Array.isArray(assessment?.recommendations) &&
		!!assessment?.recommendations[0]?.recommendation?.length &&
		!!assessment?.recommendations[1]?.recommendation?.length &&
		!!assessment?.recommendations[2]?.recommendation?.length;

	const masteryUserReady =
		assessment?.mastery?.filter((m) => m.employeeRating).length >= 4;
	const masterySupervisorReady =
		assessment?.mastery?.filter((m) => m.supervisorRating).length >= 4;

	if (assessment?.type === AssessmentType.SIMPLIFIED) {
		if (assessment?.status === AssessmentStatus.SELF_ASSESSMENT) {
			return masteryUserReady && assessment?.user?.id === user?.id;
		}
		if (assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT) {
			return masterySupervisorReady && assessment?.evaluator?.id === user?.id;
		}
		if (assessment.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) {
			return (
				masteryUserReady &&
				masterySupervisorReady &&
				assessment?.user?.id === user?.id
			);
		}
		if (assessment?.status === AssessmentStatus.COMPLETED) {
			return false;
		}
		return false;
	}

	if (assessment?.status === AssessmentStatus.SELF_ASSESSMENT) {
		return (
			lastYearUserReady &&
			nextYearReady &&
			competencyUserReady &&
			masteryUserReady &&
			assessment?.user?.id === user?.id
		);
	}
	if (assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT) {
		return (
			lastYearSupervisorReady &&
			nextYearReady &&
			competencySupervisorReady &&
			masterySupervisorReady &&
			assessment?.evaluator?.id === user?.id
		);
	}
	if (assessment?.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) {
		return (
			lastYearUserReady &&
			lastYearSupervisorReady &&
			nextYearReady &&
			competencyUserReady &&
			competencySupervisorReady &&
			masteryUserReady &&
			masterySupervisorReady &&
			assessment?.user?.id === user?.id
		);
	}
	if (assessment?.status === AssessmentStatus.SUPERVISOR_CONCLUSION) {
		return (
			lastYearUserReady &&
			lastYearSupervisorReady &&
			nextYearReady &&
			competencyUserReady &&
			competencySupervisorReady &&
			masteryUserReady &&
			masterySupervisorReady &&
			recommendationsReady &&
			assessment?.evaluator?.id === user?.id
		);
	}
	if (assessment?.status === AssessmentStatus.COMPLETED) {
		return false;
	}
	return false;
};

const getIsReadyForPrevStep = (assessment: Assessment, user?: UserData) => {
	if (assessment?.type === AssessmentType.SIMPLIFIED) {
		if (assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT) {
			return false;
		}
		if (assessment.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) {
			return assessment?.user?.id === user?.id;
		}
		if (assessment?.status === AssessmentStatus.COMPLETED) {
			return assessment?.evaluator?.id === user?.id;
		}
		return false;
	}

	if (assessment?.status === AssessmentStatus.SELF_ASSESSMENT) {
		return false;
	}
	if (assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT) {
		return assessment?.evaluator?.id === user?.id;
	}
	if (assessment?.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) {
		return assessment?.user?.id === user?.id;
	}
	if (assessment?.status === AssessmentStatus.SUPERVISOR_CONCLUSION) {
		return assessment?.evaluator?.id === user?.id;
	}
	if (assessment?.status === AssessmentStatus.COMPLETED) {
		return assessment?.evaluator?.id === user?.id;
	}
};

export { getIsReadyForNextStep, getIsReadyForPrevStep };

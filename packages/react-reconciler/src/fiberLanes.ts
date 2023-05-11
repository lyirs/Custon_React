import ReactCurrentBatchConfig from 'react/src/currentBatchConfig';
import {
	unstable_getCurrentPriorityLevel,
	unstable_IdlePriority,
	unstable_ImmediatePriority,
	unstable_NormalPriority,
	unstable_UserBlockingPriority
} from 'scheduler';
import { FiberRootNode } from './fiber';

export type Lane = number;
export type Lanes = number;

export const SyncLane = 0b00001;
export const NoLane = 0b00000;
export const NoLanes = 0b00000;
export const InputContinousLane = 0b00010;
export const DefaultLane = 0b00100;
export const TransitionLane = 0b01000;
export const IdleLane = 0b10000;

export const mergeLanes = (laneA: Lane, laneB: Lane): Lanes => {
	return laneA | laneB;
};

export const requestUpdateLane = () => {
	// transition
	const isTransition = ReactCurrentBatchConfig.transition !== null;
	if (isTransition) {
		return TransitionLane;
	}
	// 从上下文环境中获取Scheduler优先级
	const currentSchedulerPriority = unstable_getCurrentPriorityLevel();
	const lane = schedulerPriorityToLane(currentSchedulerPriority);
	return lane;
};

export const getHighestPriorityLane = (lanes: Lanes): Lane => {
	return lanes & -lanes;
};

export const isSubsetOfLanes = (set: Lanes, subset: Lane) => {
	return (set & subset) === subset;
};

export const markRootFinished = (root: FiberRootNode, lane: Lane) => {
	root.pendingLanes &= ~lane;
};

export const lanesToSchedulerPriority = (lanes: Lanes) => {
	const lane = getHighestPriorityLane(lanes);
	if (lane === SyncLane) {
		return unstable_ImmediatePriority;
	}
	if (lane === InputContinousLane) {
		return unstable_UserBlockingPriority;
	}
	if (lane === DefaultLane) {
		return unstable_NormalPriority;
	}
	return unstable_IdlePriority;
};

export const schedulerPriorityToLane = (schedulerPriority: number): Lane => {
	if (schedulerPriority === unstable_ImmediatePriority) {
		return SyncLane;
	}
	if (schedulerPriority === unstable_UserBlockingPriority) {
		return InputContinousLane;
	}
	if (schedulerPriority === unstable_NormalPriority) {
		return DefaultLane;
	}
	return NoLane;
};

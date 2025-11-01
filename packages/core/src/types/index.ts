export type TaskCallback<T> = (() => void) | (() => Promise<T>)

export type TaskEnabled = (() => boolean) | boolean

export interface Task<T = unknown> {
	id: string
	name?: string
	createdAt: number
	startAt: number
	expireAt: number
	enabled: TaskEnabled

	callback: TaskCallback<T>
	onRemove?: <T extends Task<T>>(task: T) => void
}

export interface IntervalTask<T = unknown> extends Task<T> {
	interval: number
	lastRunAt: number | undefined
	totalRunCount: number
}

export interface IntervalTaskCreatePayload<T = unknown> {
	startAt: number
	interval: number
	name?: string
	enabled?: TaskEnabled
	expireAt?: number
	callback: TaskCallback<T>
	onRemove?: <T extends Task<T>>(task: T) => void
}

export interface IntervalTaskRunnerConfig extends BaseRunnerConfig {}

export interface OneTimeTask<T = unknown> extends Task<T> {}

export interface OneTimeTaskCreatePayload<T = unknown> {
	startAt: number
	name?: string
	enabled?: TaskEnabled
	expireAt?: number
	callback: TaskCallback<T>
	onRemove?: <T extends Task<T>>(task: T) => void
}

export interface OneTimeTaskRunnerConfig extends BaseRunnerConfig {}

export interface BaseRunnerConfig {
	start?: boolean
}

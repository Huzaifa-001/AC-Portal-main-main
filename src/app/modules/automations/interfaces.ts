export interface AutomationEntity {
    id: number;
    name: string;
    isActive: boolean;
    triggerType: string;
    triggerRecord: string | null;
    whenEntityIs: string | null;
    duration: number | null;
    timeUnit: string | null;
    beforeAfter: string | null;
    isSpecificDay: boolean | null;
    selectedDay: string | null;
    isSpecificTime: boolean | null;
    selectedTime: string | null;
    automationTriggerDateField: string | null;
    requireAllConditionsToBeTrue: boolean;
    conditions: ConditionEntity[];
    actions: ActionEntity[];
}

export interface ConditionEntity {
    id: number;
    field: string;
    value: string;
    comparison: string;
    onlyIfModified: boolean;
}

export interface ActionEntity {
    id: number;
    actionType: string;
    name: string;
    actionObj: string;
}


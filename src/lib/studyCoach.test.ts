import {describe,it,expect} from 'vitest';
import {freshProgress} from './engine';
import {topicInsights,priorityTopics,weeklyAnswers} from './studyCoach';
describe('study coach',()=>{
 it('covers all outcomes and prioritises without manufacturing an accuracy',()=>{const p=freshProgress();const t=topicInsights(p);expect(t).toHaveLength(16);expect(t[0].accuracy).toBeNull();expect(t.every(x=>Number.isFinite(x.priority))).toBe(true);expect(priorityTopics(p,3)).toHaveLength(3)});
 it('counts recent activity without altering progress',()=>{const p=freshProgress();expect(weeklyAnswers(p)).toHaveLength(7);expect(p.attempts).toHaveLength(0)});
});

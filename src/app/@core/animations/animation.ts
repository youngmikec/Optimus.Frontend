import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

export const slideInOutFromRight = trigger('slideInOutFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('300ms ease-out', style({ transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)' })),
  ]),
]);

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('300ms ease-out', style({ transform: 'translateX(0)' })),
  ]),
]);

export const detailExpand = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition(
    'expanded <=> collapsed',
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ),
]);

export const fadeInDown = trigger('fadeInDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

import {
  trigger,
  transition,
  style,
  animate,
  query,
} from '@angular/animations';

const mainContentPadding: string = '1rem';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: mainContentPadding,
          left: mainContentPadding,
          bottom: mainContentPadding,
          right: mainContentPadding,
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        animate(
          '0.15s ease',
          style({
            opacity: 1,
          })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
]);

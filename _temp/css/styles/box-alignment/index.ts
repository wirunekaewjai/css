import { Property } from '../../types/style';

function create (k: string, p: string[]): Property
{
  return {
    selector: [k],
    props: p,
  };
}

export default {
  align_content: {
    center: create(
      'align-content-center', 
      ['align-content: center']
    ),

    start: create(
      'align-content-flex-start',
      ['align-content: flex-start'],
    ),

    end: create(
      'align-content-flex-end', 
      ['align-content: flex-end'],
    ),

    space_between: create(
      'align-content-space-between',
      ['align-content: space-between'],
    ),

    space_around: create(
      'align-content-space-around',
      ['align-content: space-around'],
    ),

    space_evenly: create(
      'align-content-space-evenly',
      ['align-content: space-evenly'],
    ),
  },

  align_items: {
    center: create(
      'align-items-center',
      ['align-items: center'],
    ),

    start: create(
      'align-items-start',
      ['align-items: flex-start'],
    ),

    end: create(
      'align-items-end',
      ['align-items: flex-end'],
    ),

    baseline: create(
      'align-items-baseline',
      ['align-items: baseline'],
    ),

    stretch: create(
      'align-items-stretch',
      ['align-items: stretch'],
    ),
  },

  align_self: {
    center: create(
      'align-self-center',
      ['align-self: center'],
    ),

    start: create(
      'align-self-start',
      ['align-self: flex-start'],
    ),

    end: create(
      'align-self-end',
      ['align-self: flex-end'],
    ),

    auto: create(
      'align-self-auto',
      ['align-self: baseline'],
    ),

    stretch: create(
      'align-self-stretch',
      ['align-self: stretch'],
    ),
  },

  justify_content: {
    center: create(
      'justify-content-center',
      ['justify-content: center'],
    ),

    start: create(
      'justify-content-start',
      ['justify-content: flex-start'],
    ),

    end: create(
      'justify-content-end',
      ['justify-content: flex-end'],
    ),

    space_between: create(
      'justify-content-between',
      ['justify-content: space-between'],
    ),

    space_around: create(
      'justify-content-around',
      ['justify-content: space-around'],
    ),

    space_evenly: create(
      'justify-content-evenly',
      ['justify-content: space-evenly'],
    ),
  },

  justify_items: {
    center: create(
      'justify-items-center',
      ['justify-items: center'],
    ),

    start: create(
      'justify-items-start',
      ['justify-items: start'],
    ),

    end: create(
      'justify-items-end',
      ['justify-items: end'],
    ),

    auto: create(
      'justify-items-auto',
      ['justify-items: auto'],
    ),

    stretch: create(
      'justify-items-stretch',
      ['justify-items: stretch'],
    ),
  },

  justify_self: {
    center: create(
      'justify-self-center',
      ['justify-self: center'],
    ),

    start: create(
      'justify-self-start',
      ['justify-self: start'],
    ),

    end: create(
      'justify-self-end',
      ['justify-self: end'],
    ),

    auto: create(
      'justify-self-auto',
      ['justify-self: auto'],
    ),

    stretch: create(
      'justify-self-stretch',
      ['justify-self: stretch'],
    ),
  },
}
//liquid-fire animations
export default function() {
  this.transition(
    this.fromRoute('students'),
    this.toRoute('student'),
    this.use('explode', {
      matchBy: 'student-id',
      use: ['flyTo', {
        duration: 500
      }]
    }, {
      use: ['crossFade', {
        duration: 100
      }]
    })
  );


  this.transition(
    this.childOf('.animated-tiles'),
    this.use('explode', {
      matchBy: 'session-id',
      use: ['fly-to', {
        duration: 400
      }]
    })
  );
}
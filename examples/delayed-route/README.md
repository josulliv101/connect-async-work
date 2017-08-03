connect-async-work delay route transition example
=================================================

This example demonstrates using DelayRoute to delay transitioning to a new route
and display the old route during the delay. The delay is based on a <bool>delay
prop which is most likely looking at some state from the store. For example, the
delay prop may reflect when all async data has been loaded.

See https://github.com/josulliv101/delay-route for more info.

connect-async-work universal example
====================================

This is the universal example. It demonstrates loading async data both
on the server and client. On the server a custom redux store enhancer is
used to only emit when async work is complete, giving a chance to do a 
final render with all data loaded.

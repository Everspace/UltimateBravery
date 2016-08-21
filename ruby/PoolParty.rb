require 'thread'

class PoolParty
  def self.process_queue(
    collection: [],
    thread_number: 4,
    at_setup:nil,
    at_perform:nil,
    at_thread_end:nil,
    at_ensure:nil,
    catch_these:{},
    abort_on_exception: false)
    throw ArgumentException unless at_perform

    q = Queue.new()
    collection.each {|i| q.push(i)}
    begin
      at_setup.to_proc.call() if at_setup

      threads = (0..thread_number).collect do
        Thread.new do
          Thread.current.abort_on_exception = abort_on_exception
          begin
            while item = q.pop(false)
              if at_perform.arity > 0 then
                at_perform.to_proc.call(*item)
              else
                at_perform.to_proc.call()
              end
            end
          rescue ThreadError
            puts 'End of thread'
            at_thread_end.call() if at_thread_end == Proc
          end
        end
      end
      puts threads.class
      threads.each(&:join)
    rescue => e
      if catch_these.has_key?(e.class) then
        catch_these[e.class].to_proc.call(e)
      else
        msg = "PoolParty is over, uncaught exception of type #{e.class}"
        msg += "\n"
        msg += e.message
        raise e.class, msg
      end
    ensure
      at_ensure.to_proc.call() if at_ensure
    end
    return true
  end
end

PoolParty.process_queue(
  collection:(0..100),
  at_perform: Proc.new { |number|
    puts "Why hello #{number}"
  }
)

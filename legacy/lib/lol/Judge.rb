here = File.dirname(
  File.expand_path('.', __FILE__)
)

the_judges = Dir.glob("#{here}/judges/*Judge.rb")
the_judges.each &method(:require)

names = the_judges.map {|fname| File.basename(fname, '.rb')}
  .inject({}) {|memory, class_name|
    klass = Object.const_get class_name
    if klass.constants.include? :MANAGES
      sym = klass.const_get :MANAGES
      memory[sym] = klass
    end
    memory
  }

class Judge end

Judge.define_singleton_method(:can_judge?) do |symbol|
  names.has_key? symbol
end

Judge.define_singleton_method(:[]) do |symbol|
  names[symbol]
end


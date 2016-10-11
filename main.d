import std.xml;
import std.stdio;
import std.string;
import std.file;

struct Log
{
	string code;
	string time;
	string result;
	string comment;
}

void main(string[] args)
{
	//Check if the right number of arguments
	if(args.length!=3){
		writeln("You need to pass the Garmin log file and myFind file");
		return;
	}
	//Set the filenames
	auto gc_logs_filename = args[1];
	auto myfind_filename = args[2];


	//Read the files
	string gc_logs_file = cast(string)read(gc_logs_filename);
	string myfind_file = cast(string)read(myfind_filename);

	//Create array of logs
	Log[] logs;

	//Parse the Garmin file
	auto xml = new DocumentParser(gc_logs_file);
	xml.onStartTag["log"] = (ElementParser xml)
	{
		Log log;

		xml.onEndTag["code"]           = (in Element e) { log.code      = e.text(); };
		xml.onEndTag["time"]           = (in Element e) { log.time      = e.text(); };
		xml.onEndTag["result"]         = (in Element e) { log.result    = e.text(); };
		xml.onEndTag["comment"]        = (in Element e) { log.comment   = e.text(); };

		xml.parse();

		logs ~= log;
	};
	xml.parse();

	//Array of myfinds
	Log[] myfinds;

	//Parse the myFind file
	xml = new DocumentParser(myfind_file);
	xml.onStartTag["wpt"] = (ElementParser xml)
	{
		Log log;

		xml.onEndTag["name"]           = (in Element e) { log.code      = e.text(); };

		xml.parse();

		myfinds ~= log;
	};
	xml.parse();

	// Filter already found (using O(n^2) :( )
	for(int i=0;i<logs.length;i++){
		for(int j=0;j<myfinds.length;j++){
			if(logs[i].code==myfinds[j].code){
				logs[i].result="";
			}
		}
	}

	// Print a javascript array
	int count=0;
	write("let logs = [");
	bool first=true;
	foreach(log;logs){
		if(log.result=="found it"){
			count++;
			auto s= "";
			if(first){
				first=false;
			}
			else{
				s~=",";
			}
			s~="{";
			s~="geocode : \"" ~ log.code ~ "\",";
			s~="time : \"" ~ log.time ~ "\"";
			s~="}";
			write(s);
		}
	}
	writeln("]");
}

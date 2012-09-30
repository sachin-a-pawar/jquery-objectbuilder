(function ($)
{
    $.objectbuilder = $.objectbuilder || {};

    $.objectbuilder.toObject = function (options)
    {

        var defaults =
        {
            parent: '',
            selectors: ''
        };

        options = $.extend(defaults, options);

        function convert(selectors, prefix)
        {
            var object = new Object();
            var localvar;
            if (typeof (selectors) === 'undefined')
                return object;
            selectors = $.trim(selectors);

            if (selectors === '')
                return object;

            if (prefix)
            {
                object[prefix] = new Object();
                localvar = object[prefix];
            }
            else
                localvar = object

            $(selectors).each(function (index, control)
            {
                control = $(control);
                var names = tokenizeName(control.attr('name'));
                setProperty(names, localvar, control.val());

            });

            return object;
        }
        function tokenizeName(name)
        {
            var names = [];

            if (name)
            {
                names = name.split('.');
            }

            return names;
        }

        function setProperty(names, instance, value)
        {
            var isarrayelement = false;
            var name;
            var property = instance;
            var namesLength = names.length;
            var position = -1;
            for (var index = 0; index < namesLength; index++)
            {
                name = names[index];
                isarrayelement = isArray(name);
                position = -1;
                if (isarrayelement)
                    position = getArrayIndex(name);
                name = getPropertyName(name, isarrayelement);

                if (property[name])
                {
                    if (isarrayelement)
                    {
                        initializeArray(property[name], position);
                        property = property[name][position];
                    }
                    else
                        property = property[name];

                }
                else if (index + 1 == namesLength)
                {
                    property[name] = value;
                    break;
                }
                else
                {
                    if (isarrayelement)
                    {
                        property[name] = new Array();
                        initializeArray(property[name], position);
                        property = property[name][position];
                        
                    }
                    else
                    {
                        property[name] = new Object();
                        property = property[name];
                    }
                }
            }
        }

        function initializeArray(arr, length)
        {
            for (var iindex = arr.length; iindex <= length; iindex++)
            {
                arr[iindex] = new Object();
            }
        }

        function getPropertyName(name, arrayelement)
        {
            return arrayelement ? name.substring(0, name.indexOf('[')) : name;
        }

        function getArrayIndex(name)
        {
            var startindex = name.indexOf('[');
            var lastindex = name.indexOf(']');
            if (startindex == lastindex || startindex < 0 || lastindex < 0)
                return -1;
            else
            {
                var index = name.substring(startindex + 1, lastindex);
                if (isNaN(index))
                    return -1;
                else
                    return Number(index);
            }
        }
        function isArray(name)
        {
            var result = false;
            if (name)
            {
                result = name.indexOf('[') > 0;
            }
            return result;
        }
        return convert(options.selectors, options.parent);
    };
})(jQuery);
